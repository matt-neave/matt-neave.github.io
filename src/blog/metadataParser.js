export const parseMetadata = (markdownText) => {
    // Regular expression to match the title, date, author, and content
    const regex = /^---\s*title:\s*"([^"]+)"\s*date:\s*"([^"]+)"\s*author:\s*"([^"]+)"\s*---\s*([\s\S]*)$/m;

    // Match the input text with the regular expression
    const match = markdownText.match(regex);

    // If there's a match, extract the groups and return them in an object
    if (match) {
        const [, title, date, author, content] = match;
        return {
            title,
            date,
            author,
            content: content.trim()
		};
    } else {
        // Optionally, you can handle the case where the format is incorrect
        return {
			title: 'Unknown',
			date: 'Unknown',
			author: 'Unknown',
			content: markdownText
		}
    }
};