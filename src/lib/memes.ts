import m1 from "@/assets/memes/IMG_1564.gif.asset.json";
import m2 from "@/assets/memes/IMG_1565.jpeg.asset.json";
import m3 from "@/assets/memes/IMG_1566.jpeg.asset.json";
import m4 from "@/assets/memes/IMG_1567.webp.asset.json";
import m5 from "@/assets/memes/IMG_1568.gif.asset.json";
import m6 from "@/assets/memes/IMG_1569.jpeg.asset.json";
import m7 from "@/assets/memes/IMG_1570.jpeg.asset.json";
import m8 from "@/assets/memes/IMG_1571.png.asset.json";
import m9 from "@/assets/memes/IMG_1572.png.asset.json";
import m10 from "@/assets/memes/IMG_1573.png.asset.json";

export const SPLASH_MEMES: string[] = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10].map((a) => a.url);
export const randomMeme = () => SPLASH_MEMES[Math.floor(Math.random() * SPLASH_MEMES.length)];
