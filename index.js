import { process } from './env.js'

const setupTextarea = document.getElementById('setup-textarea') 
const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')

const apiKey = process.env.OPENAI_API_KEY
const url = "https://api.openai.com/v1/chat/completions"
const urlImg = "https://api.openai.com/v1/images/generations"

document.getElementById("send-btn").addEventListener("click", () => {
  if (setupTextarea.value) {
    const userInput = setupTextarea.value
    setupInputContainer.innerHTML = '<img src="images/loading.svg" class="loading" id="loading">'
    movieBossText.innerText = 'Great, that sounds intriguing! Give me a few minutes to ponder on it....'
    // fetchBotReply(userInput)
    fetchSynopsis(userInput)
  }

  
})

function fetchBotReply(outline){




fetch( url, {
  method: 'POST',
  headers: {
    'Content-Type' : 'application/json',
    'Authorization' : `Bearer ${apiKey}`
  },
  body: JSON.stringify({
  'model': 'gpt-3.5-turbo',
  'messages':[
  {
    "role": "system",
    "content": "You are a helpful assistant."
  },
  {
    "role": "user",
    "content": `Generate a short message to enthusiastically say "${outline}" sounds interesting and that you need some minutes to think about it. Keep the message simple and short.`
  }
  ],
    'temperature': 0.7
  })
}).then(response => response.json()).then(data => 
     movieBossText.innerText = data.choices[0].message.content
   )
}

function fetchSynopsis(outline) {
  
fetch( url, {
  method: 'POST',
  headers: {
    'Content-Type' : 'application/json',
    'Authorization' : `Bearer ${apiKey}`
  },
  body: JSON.stringify({
  'model': 'gpt-3.5-turbo',
  'messages':[
  {
    "role": "system",
    "content": "You are a helpful assistant."
  },
  {
    "role": "user",
    "content": `Generate an engaging, professional and marketable movie synopsis based on the following idea: ${outline}. Don't add any title, within the synopsis text don't mention any title`
  }
  ],
    'temperature': 0.7
  })
}).then(response => response.json()).then(data => {
     const synopsis = data.choices[0].message.content.trim()
     document.getElementById('output-text').innerText = synopsis
     fetchTitle(synopsis)
   
   })

}

function fetchTitle(synopsis){

fetch( url, {
  method: 'POST',
  headers: {
    'Content-Type' : 'application/json',
    'Authorization' : `Bearer ${apiKey}`
  },
  body: JSON.stringify({
  'model': 'gpt-3.5-turbo',
  'messages':[
  {
    "role": "system",
    "content": "You are a helpful assistant."
  },
  {
    "role": "user",
    "content": `Generate an attractive movie title based on the following synopsis: ${synopsis}`
  }
  ],
    'temperature': 0.7
  })
}).then(response => response.json()).then(data => {

    const title =data.choices[0].message.content.trim()
    document.getElementById('output-title').innerText = title
    fetchImagePrompt(title, synopsis)

    }
  )


  
    
}


 function fetchImagePrompt(title, synopsis){
  fetch( url, {
  method: 'POST',
  headers: {
    'Content-Type' : 'application/json',
    'Authorization' : `Bearer ${apiKey}`
  },
  body: JSON.stringify({
  'model': 'gpt-3.5-turbo',
  'messages':[
  {
    "role": "system",
    "content": "You are a helpful assistant."
  },
  {
    "role": "user",
    "content": `Give a short description of an image which could be used to advertise a movie based on the following title and synopsis: ${title}, ${synopsis}`
  }
  ],
    'temperature': 0.7
  })
}).then(response => response.json()).then(data => {

      const imagePrompt = data.choices[0].message.content.trim()

      console.log(imagePrompt)

      fetchImageUrl(imagePrompt)

  })


 }


  function fetchImageUrl(imagePrompt){

  fetch( urlImg, {
  method: 'POST',
  headers: {
    'Content-Type' : 'application/json',
    'Authorization' : `Bearer ${apiKey}`
  },
  body: JSON.stringify( {
    "prompt": `${imagePrompt}.There should be no text in this image.`,
    "n": 1,
    "size": "512x512"
  })
}).then(response => response.json()).then(data => {

     const imageUrl = data.data[0].url
     console.log(imageUrl)
     document.getElementById('output-img-container').innerHTML = `<img src="${imageUrl}">`

    setupInputContainer.innerHTML = `<button id="view-pitch-btn" class="view-pitch-btn">View Result</button>`
  document.getElementById('view-pitch-btn').addEventListener('click', () => {
    document.getElementById('setup-container').style.display = 'none'
    document.getElementById('output-container').style.display = 'flex'
    movieBossText.innerText = `This idea is so good I'm jealous! It's gonna make you rich for sure! Remember, I want 10% 💰`
  })


  })


      

 }

  
  
  



