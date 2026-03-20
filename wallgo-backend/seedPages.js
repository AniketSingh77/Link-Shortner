const mongoose = require('mongoose');
const Page = require('./models/Page');
require('dotenv').config();

const seedPages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const pages = [
            {
                title: 'Frequently Asked Questions',
                slug: 'faq',
                content: `## General Questions
### What is Wallgo Links?
Wallgo Links is a completely free tool where you can create short links, which apart from being free, you get paid! So, now you can make money from home, when managing and protecting your links.

### How and how much do I earn?
How can you start making money with Wallgo Links? It's just 3 steps: create an account, create a link and post it - for every visit, you earn money. It's just that easy!

### Referral Program
The Wallgo Links referral program is a great way to spread the word of this great service and to earn even more money with your short links! Refer friends and receive 20% of their earnings for life!

## Technical Questions
### Can I use this for social media?
Yes, our links are safe for most social media platforms. However, always follow the rules of the platform you are sharing on.`
            },
            {
                title: 'Privacy Policy',
                slug: 'privacy',
                content: `## Privacy Policy
Your privacy is important to us. It is Wallgo Links' policy to respect your privacy regarding any information we may collect from you across our website.

### Information we collect
We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.

### Log Data
When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your computer's IP address, browser type and version, the pages you visit, and other statistics.`
            },
            {
                title: 'Terms of Use',
                slug: 'terms',
                content: `## Terms of Service
By accessing the website at http://localhost:5173, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.

### Use License
Permission is granted to temporarily download one copy of the materials (information or software) on Wallgo Links' website for personal, non-commercial transitory viewing only.

### Prohibited Content
You may not use our service to shorten links that lead to:
- Adult content
- Illegal substances
- Copyrighted material
- Malware or phishing sites`
            },
            {
                title: 'DMCA Policy',
                slug: 'dmca',
                content: `## DMCA Notice
Wallgo Links respects the intellectual property rights of others. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please notify our DMCA agent.

### Reporting Copyright Infringement
To report a copyright infringement, please provide:
- A physical or electronic signature of the copyright owner.
- Identification of the copyrighted work claimed to have been infringed.
- Identification of the material that is claimed to be infringing.
- Contact information: address, telephone number, and email.`
            },
            {
                title: 'Contact Us',
                slug: 'contact-us',
                content: `## Get in Touch
Have questions or need support? We're here to help!

### Support Email
For general inquiries and support, please email us at:
**support@wallgo-links.com**

### Business Inquiries
For business and partnership opportunities:
**admin@wallgo-links.com**

### Telegram
Join our community on Telegram:
**@WallgoLinksSupport**`
            },
            {
                title: 'Report Abuse',
                slug: 'report',
                content: `## Report Abuse
We take abuse of our service very seriously. If you find any link hosted on our service that violates our terms of service, please report it immediately.

### What to Report
- Spam or phishing links
- Malware or virus-carrying links
- Illegal content
- Trademark or copyright infringement

### How to Report
Please send the offending link and a brief description of the violation to **abuse@wallgo-links.com**.`
            }
        ];

        for (const p of pages) {
            await Page.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
            console.log(`Seeded page: ${p.slug}`);
        }

        console.log('Seeding complete');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed', err);
        process.exit(1);
    }
};

seedPages();
