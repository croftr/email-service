import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
const mime = require('mime-types');

let transporter: nodemailer.Transporter;

export const emailContent = (marking: string, body: string) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title</title>
    <style>
        header {
            background-color: orange;
            color: #fff;            
            text-align: center;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }        
        footer {
            background-color: #333;
            color: #fff;
            padding: 0px;
            text-align: center;
            position: fixed;
            bottom: 0;
            width: 100%;
        }        
        article {
            padding: 12px 0px 12px 0px;            
        }
    </style>
</head>

<body>

    <header>
        <h1>${marking}</h1>
    </header>

    <article>
        ${body}
    </article>
       
    <footer>
        <p>This email has been sent via robs email service</p>
    </footer>

</body>

</html>
`

export const setup = () => {

    transporter = nodemailer.createTransport({
        host: "smtpout.secureserver.net",
        port: 465, //ssl on
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

}

//TODO from to should be array
type sendMailParams = {
    marking: string,
    from: string,
    to: Array<string>,
    cc: Array<string>,
    bcc: Array<string>,
    title: string,
    body: string,
    files: Array<any>
}

export const sendMail = async ({ marking, from, to, cc, bcc, title, body, files }: sendMailParams) => {

    const attachments: Array<any> = [];

    files.forEach(i => {
        const contentType = i.mimetype || mime.lookup(i.originalname.split('.')[1]);
        attachments.push({
            filename: i.filename,
            path: i.path,
            contentType
        })
    })

    const info = await transporter.sendMail({
        from,
        to,
        cc,
        bcc,
        subject: title,
        html: emailContent(marking, body),
        attachments
    });

    console.log("Message sent: %s", info.messageId);

    cleanup(attachments.map(i => i.path));

}

//delete files
export const cleanup = (filepaths:Array<string>) => {
    filepaths.forEach(i => fs.unlinkSync(i))    
}