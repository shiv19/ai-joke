export default {
  async fetch(request, env) {
    const topics = [
      "cats", "dogs", "pizza", "programming", "aliens", "coffee", "superheroes", "unicorns",
      "social media", "gardening", "time travel", "robots", "pirates", "ninjas", "zombies",
      "magic", "space exploration", "AI", "yoga", "cooking", "video games", "books", "movies",
      "music", "art", "sports", "weather", "conspiracy theories", "fashion", "travel", "food",
      "cars", "history", "science", "technology", "politics", "education", "health", "fitness",
      "relationships", "dreams", "insects", "ocean life", "mythology", "holidays", "celebrities",
      "dinosaurs", "inventions", "languages", "philosophy"
    ];

    const adjectives = [
      "funny", "silly", "clever", "witty", "absurd", "hilarious", "ridiculous", "punny",
      "sarcastic", "ironic", "dry", "corny", "cheesy", "dad-joke-style", "satirical",
      "slapstick", "deadpan", "self-deprecating", "observational", "topical"
    ];

    const jokeTypes = [
      "pun", "one-liner", "knock-knock joke", "wordplay", "anecdote", "riddle",
      "anti-joke", "shaggy dog story", "limerick", "parody"
    ];

    const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

    const getRandomTopic = () => getRandomItem(topics);
    const getRandomAdjective = () => getRandomItem(adjectives);
    const getRandomJokeType = () => getRandomItem(jokeTypes);

    const jokePrompts = [
      () => `Tell a ${getRandomAdjective()} joke about {TOPIC}. Format the setup and punchline as separate <p> tags.`,
      () => `Create a ${getRandomJokeType()} involving {TOPIC}. Use appropriate HTML tags to structure the joke, such as <p> for setup and punchline, or <pre> for formatted text.`,
      () => `Generate a "${getRandomAdjective()}" joke related to {TOPIC}. Wrap the joke in a <div> and use <p> tags to separate setup and punchline.`,
      () => `Come up with a "Why did the {TOPIC} cross the road?" joke. Format the question in a <p> tag and the answer in another <p> tag.`,
      () => `Craft a "What do you call a {TOPIC} that..." joke. Use a <p> tag for the setup and a <strong> tag within another <p> for the punchline.`,
      () => `Make a "Two {TOPIC}s walk into a bar" joke. Structure it with multiple <p> tags for each part of the joke.`,
      () => `Create a ${getRandomAdjective()} one-liner about {TOPIC}. Wrap it in a single <p> tag with a <em> emphasis on the key word.`,
      () => `Tell a ${getRandomJokeType()} about {TOPIC}. Use appropriate HTML tags like <h3> for the title, <p> for content, and <br> for line breaks if needed.`,
      () => `Generate a "${getRandomAdjective()}" joke that involves {TOPIC}. Format it using a <blockquote> tag for the main joke and a <footer> for the punchline.`,
      () => `Create a joke that starts with "Did you hear about the {TOPIC}...". Use a <details> tag with a <summary> for the setup and the punchline inside the details.`,
      () => `Make up a ${getRandomAdjective()} limerick about {TOPIC}. Format each line of the limerick with <p> tags and use <br> for proper line breaks.`,
      () => `Tell an anti-joke about {TOPIC}. Use a <div> with a class "anti-joke" and format the content with appropriate <p> tags.`,
      () => `Create a "What's the difference between {TOPIC} and {TOPIC}" joke. Use <p> tags for the question and answer, with the key terms in <strong> tags.`,
      () => `Generate a ${getRandomAdjective()} playground joke involving {TOPIC}. Format it as a dialogue using <p> tags with "class='speaker'" for each line.`,
      () => `Come up with a ${getRandomJokeType()}-based pickup line using {TOPIC}. Wrap it in a <p> tag and use <em> for emphasis on the {TOPIC}.`,
      () => `Tell a joke from the perspective of a {TOPIC}. Use a <blockquote> tag and attribute it to the {TOPIC} using a  tag.`,
      () => `Create a "${getRandomAdjective()}" lightbulb joke featuring {TOPIC}. Format the question and answer in separate <p> tags within a <div>.`,
      () => `Generate a ${getRandomJokeType()} about a {TOPIC} trying to use modern technology. Use <p> tags for narration and <q> tags for any dialogue.`,
      () => `Tell a ${getRandomAdjective()} joke that combines {TOPIC} and {TOPIC} unexpectedly. Use a <section> tag to group the joke parts, with <h4> for subtitles if needed.`,
      () => `Create a "${getRandomAdjective()}" "roses are red" style poem-joke about {TOPIC}. Format each line in separate <p> tags within a <pre> tag to maintain the poem structure.`
    ];

    const formatInstructions = `
    Format your response using appropriate HTML tags as instructed. Ensure proper structure and readability.
    Use semantic HTML where applicable (e.g., <header>, <main>, <footer> for joke structure if appropriate).
    Add classes to tags for potential styling (e.g., class="setup", class="punchline").
    Do not use details and summary tags when creating the jokes.
    Do not include any explanations or additional text outside of the HTML-formatted joke.
    `;

    const getRandomJokePrompt = () => {
      const promptFunction = getRandomItem(jokePrompts);
      const topic = getRandomTopic(); // Store the topic for later use
      return {
        prompt: promptFunction().replace(/\{TOPIC\}/g, topic) + " " + formatInstructions,
        topic: topic
      };
    };

    const { prompt, topic } = getRandomJokePrompt();

    const cleanTopic = topic.replace(/\s/g, '');
    const encodedTopic = encodeURIComponent(cleanTopic);

    let chat = {
      messages: [
        { role: 'user', content: prompt }
      ]
    };
    let response = await env.AI.run('@cf/meta/llama-3-8b-instruct', chat);

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Joke Card</title>
    <link href="/dist/output.css" rel="stylesheet">
</head>
<body class="bg-gray-100 flex justify-center items-center h-screen m-0 font-sans">
    <div class="bg-white rounded-lg shadow-md p-6 max-w-lg text-center">
        <h2 class="text-gray-800 mb-4">Joke from Llama AI</h2>
        <div class="mb-4 min-h-16" id="jokeContainer">${response.response}</div>
        <button class="bg-blue-500 text-white rounded px-4 py-2 text-lg transition duration-300 hover:bg-blue-600" id="anotherJokeBtn">Another one</button>
        <div class="spinner w-10 h-10 border-4 border-gray-200 border-t-4 border-blue-500 rounded-full animate-spin my-4" id="spinner"></div>
        <div>
          <div class="typewriter overflow-hidden border-r-2 border-blue-500 whitespace-nowrap mx-auto tracking-wide animate-blink-caret" id="typewriter"></div>
        </div>
        <div class="mt-4">
            <img class="max-w-full h-auto rounded" src="https://loremflickr.com/320/240/${encodedTopic}" alt="Image related to ${topic}">
        </div>
    </div>

    <script>
        const messages = [
            "Llama is thinking...",
            "Crafting a hilarious punchline...",
            "Searching the comedy cosmos...",
            "Consulting the joke oracle...",
            "Polishing its funny bone..."
        ];

        function getRandomMessage() {
            return messages[Math.floor(Math.random() * messages.length)];
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function typeWriter(element, text, speed = 50) {
            for (let i = 0; i < text.length; i++) {
                element.textContent += text.charAt(i);
                await sleep(speed);
            }
        }

        async function eraseWriter(element, speed = 30) {
            let text = element.textContent;
            while (text.length > 0) {
                text = text.slice(0, -1);
                element.textContent = text;
                await sleep(speed);
            }
        }

        async function animateTypewriter() {
            const typewriter = document.getElementById('typewriter');
            typewriter.style.display = 'inline-block';

            while (true) {
                let message = getRandomMessage();
                await typeWriter(typewriter, message);
                await sleep(1500);
                await eraseWriter(typewriter);
                await sleep(500);
            }
        }

        document.getElementById('anotherJokeBtn').addEventListener('click', async function() {
            this.style.display = 'none';
            document.getElementById('spinner').style.display = 'inline-block';

            animateTypewriter();

            window.location.reload();
        });
    </script>
</body>
</html>
    `;

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  }
};
