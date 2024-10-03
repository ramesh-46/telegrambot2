const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Telegram Bot Token
const botToken = '7819767383:AAHnER9nR7vpWPFqni46h3Iq6U1nydWIBKw'; // Your Telegram bot token
// TMDb API Key
const tmdbApiKey = 'c67a4df77b53022a9d2fcec9e076040c'; // Your TMDb API key

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(botToken, { polling: true });

// TMDb API search function
const searchMovie = async (movieTitle) => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${movieTitle}`;
    try {
        const response = await axios.get(url);
        const movies = response.data.results;
        if (movies.length > 0) {
            const firstMovie = movies[0];
            return `Title: ${firstMovie.title}\nOverview: ${firstMovie.overview}\nRelease Date: ${firstMovie.release_date}`;
        } else {
            return `No results found for "${movieTitle}".`;
        }
    } catch (error) {
        return 'Error fetching movie details. Please try again later.';
    }
};

// Listen for messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const movieTitle = msg.text;

    // If user sends /start, greet them
    if (movieTitle.toLowerCase() === '/start') {
        bot.sendMessage(chatId, 'Welcome! Send me a movie title to search for.');
        return;
    }

    // Search for the movie and send the details
    const movieDetails = await searchMovie(movieTitle);
    bot.sendMessage(chatId, movieDetails);
});
