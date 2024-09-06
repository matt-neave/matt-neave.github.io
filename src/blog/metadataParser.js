export const parseMetadata = (markdownText) => {
	// Regular expression to match the title, date, author, tags, and content
	const regex = /^---\s*title:\s*"([^"]+)"\s*date:\s*"([^"]+)"\s*author:\s*"([^"]+)"\s*tags:\s*(.+?)\s*---\s*([\s\S]*)$/m;
  
	// Match the input text with the regular expression
	const match = markdownText.match(regex);
  
	if (match) {
	  const [, title, date, author, tags, content] = match;
	  // Split tags by comma and trim whitespace
	  const tagList = tags.split(',').map(tag => tag.trim());
	  return {
		title,
		date,
		author,
		tags: tagList,
		content: content.trim()
	  };
	} else {
	  return {
		title: 'Unknown',
		date: 'Coming Soon',
		author: 'Unknown',
		tags: [],
		content: markdownText
	  };
	}
  };
  