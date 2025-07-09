
const express = require('express');
const fetch = require('node-fetch');
const { createCanvas, loadImage, registerFont } = require("canvas");
registerFont("fonts/Orbitron-Bold.ttf", { family: "Orbitron" }); // fonte opcional
var fs = require('fs')
var gerarnick = require('./lib/gerarnick.js')

const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});

const path = require("path");
const { dirname } = require('path');
var __dirname = dirname(__filename);

// Middleware para JSON
app.use(express.json());

app.get("/canvas/musicard", async (req, res) => {
  try {
    const {
      nome,
      autor,
      logo,
      thumb,
      end,
      progresso = 50,
      start = "0:00",
      opacity = 0.5
    } = req.query;

    // Verificações obrigatórias
    if (!nome || !autor || !logo || !thumb || !end) {
      return res.status(400).send({
        erro: true,
        mensagem: "Campos obrigatórios: nome, autor, logo, thumb (fundo), end"
      });
    }

    const width = 900;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Imagem de fundo (thumb agora é o fundo)
    const background = await loadImage(thumb);
    ctx.drawImage(background, 0, 0, width, height);

    // Opacidade preta sobre o fundo
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    ctx.fillRect(0, 0, width, height);

    // Logo redondo (imagem de perfil)
    const logoImg = await loadImage(logo);
    const logoSize = 160;
    const logoX = 40;
    const logoY = 45;

    ctx.save();
    ctx.beginPath();
    ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    ctx.restore();

    // Título da música
    ctx.fillStyle = "#fff";
    ctx.font = "30px Orbitron";
    ctx.fillText(nome, 230, 90);

    // Nome do autor
    ctx.font = "20px Orbitron";
    ctx.fillStyle = "#ccc";
    ctx.fillText(autor, 230, 125);

    // Barra de progresso
    const barX = 230;
    const barY = 160;
    const barWidth = 500;
    const barHeight = 10;
    const progress = Math.max(0, Math.min(100, parseFloat(progresso)));

    // Barra base
    ctx.fillStyle = "#888";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Progresso
    ctx.fillStyle = "#fff";
    ctx.fillRect(barX, barY, (barWidth * progress) / 100, barHeight);

    // Tempos
    ctx.fillStyle = "#fff";
    ctx.font = "18px Orbitron";
    ctx.fillText(start, barX, barY + 25);
    ctx.fillText(end, barX + barWidth - ctx.measureText(end).width, barY + 25);

    res.setHeader("Content-Type", "image/png");
    canvas.createPNGStream().pipe(res);

  } catch (e) {
    res.status(500).send({ erro: true, mensagem: e.message });
  }
});

app.get('/api/pinterest', async (req, res) => {  
var q = req.query.q;

if (!q) {
return res.json({ status: false, resultado: 'Faltando: o parametro q com o nome.' });
}
try {
let response = await fetch(`https://nodz-apis.com.br/api/pesquisas/pinterest?query=${encodeURIComponent(q)}&apiKey=d5abb4399c`);
if (!response.ok) {
throw new Error(`Erro na API externa: ${response.statusText}`);
}

let data = await response.json();
let imageUrl = data.resultado.imagens;

if (!imageUrl) {
return res.status(404).json({ error: "Nenhuma imagem encontrada" });
}

let imageResponse = await fetch(imageUrl);
if (!imageResponse.ok) {
throw new Error(`Erro ao baixar imagem: ${imageResponse.statusText}`);
}

let contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
let imageBuffer = await imageResponse.buffer();

res.setHeader('Content-Type', contentType);
res.send(imageBuffer);

} catch (error) {
console.error("Erro ao buscar a imagem:", error);
res.status(500).json({ error: "Erro ao processar a imagem, tente novamente mais tarde." });
}
});

app.get('/api/fazernick',async (req, res) => {

const nome = req.query.nome || res.json({msg: 'insira o parametro: nome'})
await gerarnick(nome)
.then(nicks => {
res.send(nicks) 
}).catch(e => {
res.json({erro:'Erro no Servidor Interno'})
})
});

//downloads

app.get('/api/tiktok-video',async (req, res) => {
    
var q = req.query.q;

if (!q) {
return res.json({ status: false, resultado: 'Parâmetro faltando: q' });
}
try {
var response = await fetch(`https://api.nexfuture.com.br/api/downloads/tiktok/dl?url=${encodeURIComponent(q)}`);
let buffer = await response.buffer();

res.setHeader('Content-Type', 'video/mp4');
res.send(buffer);
} catch (error) {
console.error("Erro ao buscar vídeo", error);
return res.status(500).json({error: "Erro ao buscar vídeo, tente novamente mais tarde"});
}
});

app.get('/api/instagram',async(req, res) => {
var url = req.query.url;
    
if (!url) {
return res.json({ status: false, resultado: 'Parâmetros faltando: url é necessário.' });
}

try {
var response = await fetch(`https://carisys.online/api/downloads/instagram/dl/v2?url=${encodeURIComponent(url)}`);

var data = await response.json()

var texto = data.resultado

res.json({
resultado: texto
})
} catch (error) {
console.error("Erro ao buscar dados.", error)
res.status(500).json({erro: "Erro ao buscar dados."})
}
});

app.get('/api/youtube-audio',async(req, res) => {

var query = req.query.query;
    
if (!query) {
return res.json({status: false, resultado: 'Parâmetros faltando: query é necessário.'});
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/downloads/youtube/play?query=${encodeURIComponent(query)}`);

var data = await response.json()
var dados = data.resultado;

res.json({
provedor: 'Neon Apis',
imagem: dados.imagem,
titulo: dados.titulo,
desc: dados.desc,
tempo: dados.tempo,
views: dados.views,
audio: dados.audio
})
} catch (error) {
console.error("Erro ao buscar dados.", error)
res.status(500).json({erro: "Erro ao buscar dados."})
}
});

app.get('/api/yt-mp3',async (req, res) => {
var url = req.query.url;
if (!url) {
return res.json({ status: false, resultado: 'Parâmetro faltando: url' });
}
try {
var response = await fetch(`https://nodz-apis.com.br/api/downloads/youtube/audio?url=${encodeURIComponent(url)}&apiKey=d5abb4399c`);
let buffer = await response.buffer();

res.setHeader('Content-Type', 'audio/mp3');
res.send(buffer);
} catch (error) {
console.error("Erro ao buscar vídeo", error);
return res.status(500).json({error: "Erro ao buscar vídeo, tente novamente mais tarde"});
}
});

app.get('/api/youtube-search',async(req, res) => {

var query = req.query.query;
    
if (!query) {
return res.json({status: false, resultado: 'Parâmetros faltando: query é necessário.'});
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/pesquisas/youtube?query=${encodeURIComponent(query)}`);

var data = await response.json()
var dados = data.resultado;

res.json({
provedor: 'Neon Apis',
imagem: dados.imagem,
titulo: dados.titulo,
descricao: dados.descricao,
canal: dados.canal,
views: dados.views,
duracao: dados.duracao,
url: dados.url
})
} catch (error) {
console.error("Erro ao buscar dados.", error)
res.status(500).json({erro: "Erro ao buscar dados."})
}
});

app.get('/api/youtube-mix',async(req, res) => {

var query = req.query.query;
    
if (!query) {
return res.json({status: false, resultado: 'Parâmetros faltando: query é necessário.'});
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/pesquisas/youtubemix?query=${encodeURIComponent(query)}`);

var data = await response.json()
var dados = data.resultado;

res.json({
provedor: 'Neon Apis',
resultado: dados
})
} catch (error) {
console.error("Erro ao buscar dados.", error)
res.status(500).json({erro: "Erro ao buscar dados."})
}
});

app.get('/api/tiktok-search',async(req, res) => {

var query = req.query.query;
    
if (!query) {
return res.json({status: false, resultado: 'Parâmetros faltando: query é necessário.'});
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/pesquisas/tiktok/search?query=${encodeURIComponent(query)}`);

var data = await response.json()
var dados = data.resultado;

res.json({
provedor: 'Neon Apis',
resultado: dados
})
} catch (error) {
console.error("Erro ao buscar dados.", error)
res.status(500).json({erro: "Erro ao buscar dados."})
}
});

app.get('/api/playstore',async(req, res) => {

var query = req.query.query;
    
if (!query) {
return res.json({status: false, resultado: 'Parâmetros faltando: query é necessário.'});
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/pesquisas/playstore?query=${encodeURIComponent(query)}`);

var data = await response.json()
var dados = data.resultado;

res.json({
provedor: 'Neon Apis',
resultado: dados
})
} catch (error) {
console.error("Erro ao buscar.", error)
res.status(500).json({erro: "Erro ao buscar."})
}
});

app.get('/api/yt-mp4',async (req, res) => {

var url = req.query.url;

if (!url) {
return res.json({ status: false, resultado: 'Parâmetro faltando: url' });
}
try {
var response = await fetch(`https://api.nexfuture.com.br/api/downloads/youtube/mp4?url=${encodeURIComponent(url)}`);
let buffer = await response.buffer();

res.setHeader('Content-Type', 'video/mp4');
res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
res.send(buffer);
} catch (error) {
console.error("Erro ao buscar vídeo", error);
return res.status(500).json({error: "Erro ao buscar vídeo, tente novamente mais tarde"});
}
});

app.get('/api/xvideos',async(req, res) => {
var query = req.query.query;
    
if (!query) {
return res.json({status: false, resultado: 'Parâmetros faltando: query é necessário.'});
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/adultas/xvideos?query=${encodeURIComponent(query)}`);

var data = await response.json()
var dados = data.resultado;

res.json({
provedor: 'Neon Apis',
titulo: dados.titulo,
video: dados.url,
imagem: dados.imagem,
duracao: dados.duracao,
qualidade: dados.qualidade,
postado: dados.postado
})
} catch (error) {
console.error("Erro ao buscar dados.", error)
res.status(500).json({erro: "Erro ao buscar dados."})
}
});

app.get('/api/tubepussy',async(req, res) => {

var query = req.query.query;

if (!query) {
return res.json({status: false, resultado: 'Parâmetros faltando: query é necessário.'});
}
try {
var response = await fetch(`https://api.nexfuture.com.br/api/adultas/tubepussy?query=${encodeURIComponent(query)}`);

var data = await response.json()
var dados = data.resultado;

res.json({
provedor: 'Neon Apis',
titulo: dados.titulo,
video: dados.url_video,
imagem: dados.imagem,
preview: dados.preview,
duracao: dados.duracao,
postado: dados.postado
})
} catch (error) {
console.error("Erro ao buscar dados.", error)
res.status(500).json({erro: "Erro ao buscar dados."})
}
});

app.get('/api/porn-blog',async(req, res) => {

var query = req.query.query;

if (!query) {
return res.json({status: false, resultado: 'Parâmetros faltando: query é necessário.'});
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/adultas/pornoblog?query=${encodeURIComponent(query)}`);

var data = await response.json()
var dados = data.resultado;

res.json({
provedor: 'Neon Apis',
titulo: dados.titulo,
video: dados.url,
imagem: dados.imagem,
duracao: dados.duracao
})
} catch (error) {
console.error("Erro ao buscar dados.", error)
res.status(500).json({erro: "Erro ao buscar dados."})
}
});

app.get('/api/pin-video',async (req, res) => {

var url = req.query.url;

if (!url) {
return res.json({ status: false, resultado: 'Parâmetro faltando: url' });
}
try {
var response = await fetch(`https://api.nexfuture.com.br/api/downloads/pinterest/mp4?url=${encodeURIComponent(url)}`);
let buffer = await response.buffer();

res.setHeader('Content-Type', 'video/mp4');
res.send(buffer);
} catch (error) {
console.error("Erro ao buscar vídeo", error);
return res.status(500).json({error: "Erro ao buscar vídeo, tente novamente mais tarde"});
}
});

app.get('/api/insta-video',async (req, res) => {

var url = req.query.url;

if (!url) {
return res.json({status: false, resultado: 'Parâmetro faltando: url'});
}
try {
var response = await fetch(`https://api.nexfuture.com.br/api/downloads/instagram/mp4?url=${encodeURIComponent(url)}`);
let buffer = await response.buffer();

res.setHeader('Content-Type', 'video/mp4');
res.send(buffer);
} catch (error) {
console.error("Erro ao buscar vídeo", error);
return res.status(500).json({error: "Erro ao buscar vídeo, tente novamente mais tarde"});
}
});

app.get('/api/insta-audio',async (req, res) => {

var url = req.query.url;

if (!url) {
return res.json({ status: false, resultado: 'Parâmetro faltando: url' });
}
try {
var response = await fetch(`https://api.nexfuture.com.br/api/downloads/instagram/mp3?url=${encodeURIComponent(url)}`);
let buffer = await response.buffer();

res.setHeader('Content-Type', 'audio/mp3');
res.send(buffer);
} catch (error) {
console.error("Erro ao buscar vídeo", error);
return res.status(500).json({error: "Erro ao buscar vídeo, tente novamente mais tarde"});
}
});

app.get('/api/facebook',async (req, res) => {

var url = req.query.url;

if (!url) {
return res.json({status: false, resultado: 'Parâmetro faltando: url'});
}
try {
var response = await fetch(`https://api.nexfuture.com.br/api/downloads/facebook/mp4?url=${encodeURIComponent(url)}`);
let buffer = await response.buffer();

res.setHeader('Content-Type', 'video/mp4');
res.send(buffer);
} catch (error) {
console.error("Erro ao buscar vídeo", error);
return res.status(500).json({error: "Erro ao buscar vídeo, tente novamente mais tarde"});
}
});

//plaq começo

app.get('/api/plaq1', async (req, res) => {
var texto = req.query.texto;

if (!texto) {
return res.status(400).json({status: false, message: "cade o parametro texto?"})
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/plaquinhas/plaq1?query=${encodeURIComponent(texto)}`);

var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/jpeg')
res.send(buffer);
}catch (error) {
console.error("Error ao processar imagem", error);
res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
}
});

app.get('/api/plaq2', async (req, res) => {

var texto = req.query.texto;

if (!texto) {
return res.status(400).json({status: false, message: "cade o parametro texto?"})
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/plaquinhas/plaq2?query=${encodeURIComponent(texto)}`);

var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/jpeg')
res.send(buffer);
}catch (error) {
console.error("Error ao processar imagem", error);
res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
}
});

app.get('/api/plaq3', async (req, res) => {

var texto = req.query.texto;

if (!texto) {
return res.status(400).json({status: false, message: "cade o parametro texto?"})
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/plaquinhas/plaq3?query=${encodeURIComponent(texto)}`);

var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/jpeg')
res.send(buffer);
}catch (error) {
console.error("Error ao processar imagem", error);
res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
}
});

app.get('/api/plaq4', async (req, res) => {

var texto = req.query.texto;


if (!texto) {
return res.status(400).json({status: false, message: "cade o parametro texto?"})
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/plaquinhas/plaq4?query=${encodeURIComponent(texto)}`);

var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/jpeg')
res.send(buffer);
}catch (error) {
console.error("Error ao processar imagem", error);
res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
}
});

app.get('/api/plaq5', async (req, res) => {

var texto = req.query.texto;

if (!texto) {
return res.status(400).json({status: false, message: "cade o parametro texto?"})
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/plaquinhas/plaq5?query=${encodeURIComponent(texto)}`);

var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/jpeg')
res.send(buffer);
}catch (error) {
console.error("Error ao processar imagem", error);
res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
}
});

app.get('/api/plaq6', async (req, res) => {

var texto = req.query.texto;


if (!texto) {
return res.status(400).json({status: false, message: "cade o parametro texto?"})
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/plaquinhas/plaq6?query=${encodeURIComponent(texto)}`);

var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/jpeg')
res.send(buffer);
}catch (error) {
console.error("Error ao processar imagem", error);
res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
}
});

app.get('/api/plaq7', async (req, res) => {

var texto = req.query.texto;

if (!texto) {
return res.status(400).json({status: false, message: "cade o parametro texto?"})
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/plaquinhas/plaq7?query=${encodeURIComponent(texto)}`);

var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/jpeg')
res.send(buffer);
}catch (error) {
console.error("Error ao processar imagem", error);
res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
}
});

app.get('/api/plaq8', async (req, res) => {

var texto = req.query.texto;

if (!texto) {
return res.status(400).json({status: false, message: "cade o parametro texto?"})
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/plaquinhas/plaq8?query=${encodeURIComponent(texto)}`);

var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/jpeg')
res.send(buffer);
}catch (error) {
console.error("Error ao processar imagem", error);
res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
}
});

app.get('/api/plaq9', async (req, res) => {

var texto = req.query.texto;

if (!texto) {
return res.status(400).json({status: false, message: "cade o parametro texto?"})
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/plaquinhas/plaq9?query=${encodeURIComponent(texto)}`);

var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/jpeg')
res.send(buffer);
}catch (error) {
console.error("Error ao processar imagem", error);
res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
}
});

app.get('/api/plaq10', async (req, res) => {

var texto = req.query.texto;

if (!texto) {
return res.status(400).json({status: false, message: "cade o parametro texto?"})
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/plaquinhas/plaq10?query=${encodeURIComponent(texto)}`);

var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/jpeg')
res.send(buffer);
}catch (error) {
console.error("Error ao processar imagem", error);
res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
}
});

///plaq fim


//ias

app.get('/api/gemini', async(req, res) => {
var texto = req.query.texto;

if (!texto) {
return res.status(400).json({status: false, message: "cade o parametro texto?"})
}

try {
var response = await fetch(`https://yuxinze-apis.onrender.com/ias/gemini?prompt=${encodeURIComponent(texto)}`);

var data = await response.json();

var text = data.resultado.resposta;

res.json({
provedor: 'Neon Apis',
resposta: text
})
} catch (error) {
console.error("Error ao processar texto", error)
res.status(500).json({Erro: "Erro ao processar Texto. Entre em contato com meu dono!!"})
}
});

app.get('/api/gemini-pro',async(req, res) => {
var texto = req.query.texto;
if (!texto) {
return res.status(400).json({status: false, message: "cade o parametro texto?"})
}
try {
var response = await fetch(`https://api.nexfuture.com.br/api/inteligencias/gemini/pro?query=${encodeURIComponent(texto)}, resposta%20em%20portugues.`);

var data = await response.json();

var text = data.resposta

res.json({
provedor: 'Neon Apis',
resposta: text
})
} catch (error) {
console.error("Error ao processar texto", error)
res.status(500).json({Erro: "Erro ao processar Texto. Entre em contato com meu dono!"})
}
});

//ias fim

//figurinhas

app.get('/api/figu-aleatoria', async(req, res) => {
try {
var response = await fetch(`https://api.nexfuture.com.br/api/sticker/figurinhas`)
var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/webp')
res.send(buffer)
} catch (error) {
console.error("Error ao processar a api");
res.status(500).json({status: false, erro: "Erro ao processar figurinha...Entre em contato com meu dono"})
}
});

app.get('/api/figu-roblox', async(req, res) => {
try {
var response = await fetch(`https://api.nexfuture.com.br/api/sticker/figuroblox`)
var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/webp')
res.send(buffer)
} catch (error) {
console.error("Error ao processar a api");
res.status(500).json({status: false, erro: "Erro ao processar figurinha...Entre em contato com meu dono"})
}
});

app.get('/api/figu-raiva', async(req, res) => {
try {
var response = await fetch(`https://api.nexfuture.com.br/api/sticker/figuraiva`)
var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/webp')
res.send(buffer)
} catch (error) {
console.error("Error ao processar a api");
res.status(500).json({status: false, erro: "Erro ao processar figurinha...Entre em contato com meu dono"})
}
});

app.get('/api/figu-engracada', async(req, res) => {
try {
var response = await fetch(`https://api.nexfuture.com.br/api/sticker/figuengracadas`)
var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/webp')
res.send(buffer)
} catch (error) {
console.error("Error ao processar a api");
res.status(500).json({status: false, erro: "Erro ao processar figurinha...Entre em contato com meu dono"})
}
});

app.get('/api/figu-animais', async(req, res) => {
try {
var response = await fetch(`https://api.nexfuture.com.br/api/sticker/figuanimais`)
var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/webp')
res.send(buffer)
} catch (error) {
console.error("Error ao processar a api");
res.status(500).json({status: false, erro: "Erro ao processar figurinha...Entre em contato com meu dono"})
}
});

app.get('/api/figu-desenho', async(req, res) => {
try {
var response = await fetch(`https://api.nexfuture.com.br/api/sticker/figudesenho`)
var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/webp')
res.send(buffer)
} catch (error) {
console.error("Error ao processar a api");
res.status(500).json({status: false, erro: "Erro ao processar figurinha...Entre em contato com meu dono"})
}
});

app.get('/api/figu-emoji', async(req, res) => {
try {
var response = await fetch(`https://api.nexfuture.com.br/api/sticker/figuemoji`)
var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/webp')
res.send(buffer)
} catch (error) {
console.error("Error ao processar a api");
res.status(500).json({status: false, erro: "Erro ao processar figurinha...Entre em contato com meu dono"})
}
});

app.get('/api/figu-coreana', async(req, res) => {
try {
var response = await fetch(`https://api.nexfuture.com.br/api/sticker/figucoreana`)
var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/webp')
res.send(buffer)
} catch (error) {
console.error("Error ao processar a api");
res.status(500).json({status: false, erro: "Erro ao processar figurinha...Entre em contato com meu dono"})
}
});

app.get('/api/figu-anime', async(req, res) => {
try {
var response = await fetch(`https://api.nexfuture.com.br/api/sticker/figuanime`)
var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/webp')
res.send(buffer)
} catch (error) {
console.error("Error ao processar a api");
res.status(500).json({status: false, erro: "Erro ao processar figurinha...Entre em contato com meu dono"})
}
});

app.get('/api/figu-flork', async(req, res) => {
try {
var response = await fetch(`https://api.nexfuture.com.br/api/sticker/figuflork`)
var buffer = await response.buffer()

res.setHeader('Content-Type', 'image/webp')
res.send(buffer)
} catch (error) {
console.error("Error ao processar a api");
res.status(500).json({status: false, erro: "Erro ao processar figurinha...Entre em contato com meu dono"})
}
});

//end

//outos 

app.get('/api/print-site', async (req, res) => {
var url = req.query.url;
    
if (!url) {
return res.status(400).json({status: false, message: "cade o parametro url?"})
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/outros/printsite?url=${encodeURIComponent(url)}`)

if (!response.ok) {
throw new Error(`Erro na API externa: ${response.statusText}`);
}

var buffer = await response.buffer();

res.setHeader('Content-Type', 'image/jpeg')
res.send(buffer);
}
catch (error) {
console.error("Erro ao buscar a imagem:", error);
res.status(500).json({error: "Erro ao processar a imagem, tente novamente mais tarde."});
}
});

app.get('/api/logo-cartoon', async (req, res) => {
var texto = req.query.texto;
    
if (!texto) {
return res.status(400).json({status: false, message: "cade o parametro texto?"})
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/logos/cartoon?texto=${encodeURIComponent(texto)}`)

if (!response.ok) {
throw new Error(`Erro na API externa: ${response.statusText}`);
}

var buffer = await response.buffer();

res.setHeader('Content-Type', 'image/jpeg')
res.send(buffer);
}
catch (error) {
console.error("Erro ao buscar a imagem:", error);
res.status(500).json({error: "Erro ao processar a imagem, tente novamente mais tarde."});
}
});

app.get('/api/logo-write', async (req, res) => {

var texto = req.query.texto;
    
if (!texto) {
return res.status(400).json({status: false, message: "cade o parametro texto?"})
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/logos/write?texto=${encodeURIComponent(texto)}`)

if (!response.ok) {
throw new Error(`Erro na API externa: ${response.statusText}`);
}

var buffer = await response.buffer();

res.setHeader('Content-Type', 'image/jpeg')
res.send(buffer);
}
catch (error) {
console.error("Erro ao buscar a imagem:", error);
res.status(500).json({error: "Erro ao processar a imagem, tente novamente mais tarde."});
}
});

app.get('/api/avatares', async (req, res) => {
try {
var response = await fetch(`https://api.nexfuture.com.br/api/outros/avatar`)

if (!response.ok) {
throw new Error(`Erro na API externa: ${response.statusText}`);
}

var buffer = await response.buffer();

res.setHeader('Content-Type', 'image/jpeg')
res.send(buffer);
}
catch (error) {
console.error("Erro ao buscar a imagem:", error);
res.status(500).json({error: "Erro ao processar a imagem, tente novamente mais tarde."});
}
});

app.get('/api/filmes', async (req, res) => {
var nome = req.query.nome;

if (!nome) {
return res.status(400).json({status: false, message: "cade o parametro nome?"})
}
try {
var response = await fetch(`https://api.nexfuture.com.br/api/pesquisas/filmes?query=${encodeURIComponent(nome)}`);

var data = await response.json();
var texto = data.resultado

res.json({ 
Provedor: "Neon Apis",
resultado: texto
})
} catch (error) {
console.error("Error ao porcessar api")
res.status(500).json({status: false, erro: "Erro ao tentar achar o nome.... entre em contato com o meu dono!!"})
}
});

app.get('/api/series', async (req, res) => {

var nome = req.query.nome;

if (!nome) {
return res.status(400).json({status: false, message: "cade o parametro nome?"})
}
try {
var response = await fetch(`https://api.nexfuture.com.br/api/pesquisas/series?query=${encodeURIComponent(nome)}`);

var data = await response.json();
var texto = data.resultado

res.json({ 
Provedor: "Neon Apis",
resultado: texto
})
} catch (error) {
console.error("Error ao porcessar api")
res.status(500).json({status: false, erro: "Erro ao tentar achar o nome.... entre em contato com o meu dono!!"})
}
});

app.get('/api/wallpaper', async (req, res) =>{
var text = req.query.text;
  
if (!text) {
return res.status(400).json({status: false, message: "cade o parametro text?"})
}
try {
var response = await fetch(`https://api.nexfuture.com.br/api/pesquisas/wallpaper?query=${encodeURIComponent(text)}`);

var data = await response.json()

var imagens = data.resultado.filter(url => url !== null);

res.json({
resultados: imagens
})
} catch (error) {
console.error("Erro ao buscar a imagem:", error);
res.status(500).json({ error: "Erro ao processar a imagem, tente novamente mais tarde." });
}
});

app.get('/api/dicionario',async (req, res) => {
var texto = req.query.texto;

if (!texto) {
return res.status(400).json({status: false, message: "cade o parametro texto?"})
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/pesquisas/dicionario?query=${encodeURIComponent(texto)}`);

var data = await response.json()

var texto = data.resultado

res.json({
resultado: texto
})

} catch (error) {
console.error("Erro ao buscar a imagem:", error);
res.status(500).json({error: "Erro ao processar a imagem, tente novamente mais tarde."});
}
});

app.get('/api/pensador', async (req, res) => {
var text = req.query.text;

if (!text) {
return res.status(400).json({status: false, message: "cade o parametro text?"})
}

try {
var response = await fetch(`https://api.nexfuture.com.br/api/outros/pensador?query=${encodeURIComponent(text)}`);

var data = await response.json()

var texto = data.resultado

res.json({
provedor: 'Neon Apis',
resultado: texto
})
} catch (error) {
console.error("Error ao processar texto", error);
res.status(500).json({erro: "error ao processar pedido. entre em contato com o meu dono"})
}
})

//fim


// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
