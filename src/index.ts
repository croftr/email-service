
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";


var cors = require('cors')


import { sendMail, setup } from "./mailManager";
import { log } from "console";

dotenv.config();
const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const filepath = 'files';
const uploadPath = path.join(__dirname, filepath)

const multer = require("multer");
const upload = multer({ dest: uploadPath });


type options = {
  awaitResponse: boolean
}

type sendMailRequest = {
  from: string,
  to: string,
  cc: string,
  bcc: string,
  title: string,
  body: string,
  options: options
}

app.get('/', (req: Request, res: Response) => {
  res.send(`Express + TypeScript Server ${process.env.NAME} 11 `);
});


app.post('/send', upload.array("files"), async (req: Request<sendMailRequest>, res: Response) => {


  // @ts-ignore
  const { from, to, title, body, options, cc, bcc } = JSON.parse(req.body.data);

  const marking = req.get("classification");
  
  // @ts-ignore
  console.log(req.files);
  console.log("hello");
  

  // @ts-ignore
  const files: Array<any> = req.files;

  res.send({ value: `chips` });
  

  // if (options.awaitResponse) {
  //   // @ts-ignore
  //   await sendMail({ marking, from, to, cc, title, body, files });
  //   res.send({ value: `email successfully sent` });
  // } else {
  //   // @ts-ignore
  //   sendMail({ marking, from, to, cc, title, body, files });
  //   res.send({ value: `email sent` });
  // }
});

app.post('/test2', async (req: Request<sendMailRequest>, res: Response) => {
  console.log("I am in");
  
  res.send({ hello: true })

});

app.get('/test1', async (req: Request<sendMailRequest>, res: Response) => {

  res.send({ get: true })

});


app.listen(port, () => {
  setup();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});