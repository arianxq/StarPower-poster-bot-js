# StarPower Poster Bot (Node.js)

This internal tool automates the generation and delivery of weekly/monthly TikTok performance posters for creators. It processes creator data and avatar assets from S3, renders visual reports via HTML + Puppeteer, and sends them via email to designated recipients.

## Purpose

To streamline reporting for top TikTok creators by:
- Automatically extracting metrics and formatting them
- Generating visually consistent performance posters
- Delivering reports via email without manual intervention

This project is the JavaScript version of the poster bot (replacing the earlier Java version), designed for better maintainability and AWS EC2 compatibility.

## Core Features

- Parses CSV creator data and recipient lists from AWS S3  
- Matches and formats TikTok performance data  
- Dynamically renders HTML posters using language/localization support  
- Converts HTML to PNG using Puppeteer  
- Emails the poster as an attachment using Gmail (via Nodemailer)  
- Skips creators with 0 diamonds to avoid unnecessary processing  

## Tech Stack

- Node.js  
- AWS S3 (data and asset storage)  
- Puppeteer (HTML to PNG rendering)  
- Nodemailer (email delivery)  
- HTML + CSS (poster layout and styling)


## Data Flow Overview

1. **S3 CSV ingestion**  
   - Creator metrics: `bot/creator-data/*.csv`  
   - Recipient list: `bot/creator-data/*.csv`  
   - Avatars: `bot/creator-avatar/{CreatorID}.png`

2. **Poster generation**  
   - Poster content populated via `generateHtmlPoster.js`  
   - Rendered to PNG via `renderPoster.js`

3. **Email delivery**  
   - Email composed based on language and report type  
   - Poster image sent as an attachment via `sendEmail.js`

## Supported Languages

- English  
- Arabic  
*More can be added via `language_mapping.js`.*

## Notes

- All rights are reserved.  
- Currently deployed and scheduled on an internal AWS EC2 instance.  
- For scheduled execution, use a `cron` job or external trigger.
