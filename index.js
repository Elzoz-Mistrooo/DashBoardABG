    import express from 'express'
    import path from 'path'
    import { config } from 'dotenv'
    config({ path: path.resolve('./config/config.env') })
    const app = express()
    import { appRouter } from "./src/app.router.js";
    appRouter(app, express);
    // import Company from './DB/Models/company.js'

    // // ✅ بيانات 6 شركات مشهورة
    // const companies = [
    // {
    //     name: 'Pepsi',
    //     link: 'https://www.pepsi.com',
    //     logo: 'https://example.com/pepsi-logo.png',
    //     apiLink: 'https://api.pepsi.com',
    //     users: {
    //     browser: 150_000,
    //     mobile: 100_000,
    //     office: 300,
    //     backend: 50,
    //     },
    // },
    // {
    //     name: 'Coca-Cola',
    //     link: 'https://www.coca-cola.com',
    //     photo: 'https://example.com/coca-photo.jpg',
    //     logo: 'https://example.com/coca-logo.png',
    //     apiLink: 'https://api.coca-cola.com',
    //     users: {
    //     browser: 200_000,
    //     mobile: 120_000,
    //     office: 400,
    //     backend: 60,
    //     },
    // },
    // {
    //     name: 'Nike',
    //     link: 'https://www.nike.com',
    //     photo: 'https://example.com/nike-photo.jpg',
    //     logo: 'https://example.com/nike-logo.png',
    //     apiLink: 'https://api.nike.com',
    //     users: {
    //     browser: 170_000,
    //     mobile: 90_000,
    //     office: 250,
    //     backend: 40,
    //     },
    // },
    // {
    //     name: 'Adidas',
    //     link: 'https://www.adidas.com',
    //     photo: 'https://example.com/adidas-photo.jpg',
    //     logo: 'https://example.com/adidas-logo.png',
    //     apiLink: 'https://api.adidas.com',
    //     users: {
    //     browser: 130_000,
    //     mobile: 80_000,
    //     office: 230,
    //     backend: 35,
    //     },
    // },
    // {
    //     name: 'Apple',
    //     link: 'https://www.apple.com',
    //     photo: 'https://example.com/apple-photo.jpg',
    //     logo: 'https://example.com/apple-logo.png',
    //     apiLink: 'https://api.apple.com',
    //     users: {
    //     browser: 300_000,
    //     mobile: 250_000,
    //     office: 1_000,
    //     backend: 200,
    //     },
    // },
    // {
    //     name: 'Samsung',
    //     link: 'https://www.samsung.com',
    //     photo: 'https://example.com/samsung-photo.jpg',
    //     logo: 'https://example.com/samsung-logo.png',
    //     apiLink: 'https://api.samsung.com',
    //     users: {
    //     browser: 220_000,
    //     mobile: 180_000,
    //     office: 600,
    //     backend: 100,
    //     },
    // },
    // ];

    // await Company.deleteMany({});
    // await Company.insertMany(companies);
    // app.get('/api/companies', async (req, res) => {
    //     try {
    //         //http://localhost:3000/api/companies
    //       const companies = await Company.find();
    //       res.status(200).json({ companies });
    //     } catch (error) {
    //       res.status(500).json({ message: '❌ Server Error', error });
    //     }
    //   });

    // console.log('✅ Companies seeded successfully!');









    const port = process.env.PORT
    app.get('/', (req, res) => res.send('Hello World!'))
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))

    // break 10:10
