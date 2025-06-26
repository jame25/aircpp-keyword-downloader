# AirDC++ Keyword Downloader

An extension for AirDC++ that searches for directories containing NFO/TXT files with specific keywords and automatically downloads them.

## Features

- **Keyword-based NFO/TXT search**: Search for directories containing NFO/TXT files with specific keywords
- **Configurable file types**: Support for .nfo, .txt, .diz and other text files
- **Advanced search options**: Case-sensitive search, whole words only, minimum directory size
- **Download management**: Configurable download limits, target directories, and priorities
- **User exclusions**: Exclude specific users from search results
- **Search history**: Track search history and results
- **Detailed logging**: Optional detailed logging for debugging

## Installation

1. Copy the extension files to your AirDC++ extensions directory
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Enable the extension in AirDC++ settings

## Configuration

The extension can be configured through the AirDC++ settings interface:

### Search Items
- **Search name**: Descriptive name for the search
- **Keywords**: Comma-separated list of keywords to search for
- **File types**: File extensions to search in (default: .nfo, .txt, .diz)
- **Case sensitive**: Enable case-sensitive keyword matching
- **Whole words only**: Match complete words only
- **Minimum directory size**: Minimum size in MB for directories to consider
- **Maximum results**: Maximum number of results to download per search
- **Target directory**: Download destination (empty for default)
- **Priority**: Download priority (0 = default)

### Global Settings
- **Search interval**: How often to perform searches (in minutes)
- **Maximum file size**: Maximum size of NFO/TXT files to parse (in KB)
- **Search timeout**: How long to wait for search results (in seconds)
- **Enable logging**: Enable detailed logging to event log
- **Excluded users**: Comma-separated list of users to exclude

## Usage

1. Configure your search items with desired keywords
2. Enable the searches you want to run
3. The extension will automatically search at the configured intervals
4. Found directories will be downloaded automatically
5. Check the event log for search results and status messages

## Development

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development mode
npm run dev

# Run tests
npm run test
```

## License

MIT License
