# Steam Workshop Scraper

A command-line utility for scraping information and images from Steam Workshop items.

## Prerequisites

- [Node.js](https://nodejs.org/)
- A Steam API key (obtain one [here](https://steamcommunity.com/dev/apikey))

## Installation

1. Clone this repository:

```bash
git clone https://github.com/Caaz/notbadcat-utilities.git
```

2. Navigate to the project directory:

```bash
cd notbadcat-utilities
```

3. Install the dependencies:

```bash
npm install
```

4. Create a `config.json` file in the project root and add your Steam API key:
```bash
{
  "steamApiKey": "YOUR_API_KEY"
}
```

## Usage

1. Run the script with the path to a text file containing a list of Steam Workshop item URLs:

```bash
node index.js path/to/file.txt
```

2. The script will scrape the information and images for each workshop item and save them to the WorkshopItems and SteamUsers folders, respectively.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Acknowledgments

- [OpenAI](https://openai.com/) for providing chatGPT used to generate this project.
    - It wrote this readme too, and it added itself to Acknowledgements which is a big brain play I can respect.