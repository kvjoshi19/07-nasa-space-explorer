# What my project does:

NASA Space Explorer lets you pick a date range and browse real astronomy photos and videos pulled directly from NASA's official Astronomy Picture of the Day API. When you click the button, JavaScript takes your selected dates and builds a URL with them, then sends a request to NASA's servers. NASA sends back a list of objects - one for each day in your range - each containing data like the image URL, title, date, and a description. JavaScript then loops through that list and builds a gallery card for each one on the page. You can click any card to open a modal showing the full image and NASA's description for that day.

# Technologies used:

HTML, CSS, JavaScript, and Claude. I also used NASA's free APOD API to fetch the image data, and Google Fonts for typography.

# What I learned:

I learned how to make real API calls using fetch() and handle the response data in JavaScript. I also got more comfortable working with the DOM and building gallery cards and a modal from scratch based on data coming back from an API. On top of that, I learned how to work with date inputs and do date math in JavaScript.

# Challenges I solved:

One challenge was controlling how much data the app could request at once, so I added a validation check that calculates the difference in days between the selected start and end dates. If the range exceeds 30 days, it blocks the fetch and shows a warning message to the user instead.

A large date range means a huge number of results in a single request. Without a cap, a user could accidentally (or intentionally) request years worth of data, which could slow or crash the browser tab, and risks hitting NASA's API rate limits.

Throughout the project I used GitHub as well as Claude as a resource when I got stuck.