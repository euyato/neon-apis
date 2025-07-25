
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

app.get('/verificacao', (req, res) => {
  res.json({ valor: 2 }); // ou 105, qualquer um dos valores válidos
});

app.get("/canvas/ping", async (req, res) => {
  try {
    const { text, text2, text3, logo, fundo } = req.query;

    // Verificação obrigatória
    if (!text || !text2 || !text3 || !logo || !fundo) {
      return res.status(400).json({
        erro: true,
        mensagem: "Parâmetros obrigatórios: text, text2, text3, logo, fundo",
      });
    }

    const width = 1024;
    const height = 520;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Fundo
    const bg = await loadImage(fundo);
    ctx.drawImage(bg, 0, 0, width, height);

    // Configurações da logo
    const logoSize = 200;
    const logoX = width / 2 - logoSize / 2;
    const logoY = 80;
    const borderSize = 5; // Borda mais fina

// Gradiente branco para cinza claro
const gradient = ctx.createLinearGradient(logoX, logoY, logoX + logoSize, logoY + logoSize);
gradient.addColorStop(0, "#FFFFFF");   // Branco
gradient.addColorStop(1, "#D3D3D3");   // Cinza claro

// Borda circular
ctx.beginPath();
ctx.arc(width / 2, logoY + logoSize / 2, logoSize / 2 + borderSize, 0, Math.PI * 2);
ctx.lineWidth = borderSize;
ctx.strokeStyle = gradient; // Corrigido aqui
ctx.stroke();
ctx.closePath();

    // Ícone com máscara circular
    const icon = await loadImage(logo);
    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(icon, logoX, logoY, logoSize, logoSize);
    ctx.restore();

    // Nome do bot (text)
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 20;
    ctx.font = "60px Orbitron";
    ctx.fillText(text, width / 2, 370);

    // Ping (text2)
    ctx.font = "40px Orbitron";
    ctx.fillStyle = "#00FFFF";
    ctx.fillText(text2, width / 2, 430);

    // Descrição (text3)
    ctx.font = "30px Orbitron";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(text3, width / 2, 480);

    // Envia imagem
    res.setHeader("Content-Type", "image/png");
    canvas.createPNGStream().pipe(res);
  } catch (e) {
    res.status(500).json({ erro: true, mensagem: e.message });
  }
});

app.get("/canvas/welcome", async (req, res) => {  
try {
const { numero, titulo, logo, fundo } = req.query;

// Verificação obrigatória
if (!numero || !titulo || !logo || !fundo) {
return res.status(400).json({
erro: true, mensagem: "Campos obrigatórios: numero, titulo, logo e fundo",
});
}
// Remover os dois primeiros
const numeroModificado = numero.slice(2);
const width = 1000;
const height = 580;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");
// Carregar fundo
const bgImage = await loadImage(fundo);
ctx.drawImage(bgImage, 0, 0, width, height);
// Caixa transparente com borda arredondada
ctx.fillStyle = "rgba(50, 50, 50, 0.7)";  
// Transparência ajustada
ctx.beginPath();
ctx.moveTo(20, 20);
ctx.lineTo(width - 20, 20);
ctx.lineTo(width - 20, height - 20);
ctx.lineTo(20, height - 20);
ctx.closePath();
ctx.fill();
// Logo circular no centro
const logoImg = await loadImage(logo);
const logoSize = 200;  
// Tamanho da logo ajustado
const logoX = width / 2 - logoSize / 2;
const logoY = 130;  
// Adicionando borda vermelha no ícone
const borderSize = 8; 
// Tamanho da borda ajustado
ctx.beginPath();
ctx.arc(width / 2, logoY + logoSize / 2, logoSize / 2 + borderSize, 0, Math.PI * 2);
ctx.lineWidth = borderSize;
ctx.strokeStyle = "#FF0000"; // Cor vermelha
ctx.stroke();
ctx.closePath();
// Desenhar a logo
ctx.save();
ctx.beginPath();
ctx.arc(width / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
ctx.closePath();
ctx.clip();
ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
ctx.restore();
// Texto: Título (mais para cima)
ctx.fillStyle = "#fff";
ctx.textAlign = "center";
ctx.shadowColor = "red";
ctx.shadowBlur = 25;
ctx.font = "80px Orbitron";  
// Tamanho do título
ctx.fillText(titulo, width / 2, 420);  
// Ajustado para cima
// Texto: Número do usuário (mais para cima)
ctx.font = "40px Orbitron";  
// Tamanho do número
ctx.shadowBlur = 15;
 ctx.fillText(numeroModificado, width / 2, 480);  
// Ajustado para cima

// Enviar a imagem
res.setHeader("Content-Type", "image/png");
canvas.createPNGStream().pipe(res);
} catch (e) {
res.status(500).json({ erro: true, mensagem: e.message });
}
});

app.get("/canvas/musicard", async (req, res) => { 
  try {
    const { nome, autor, logo, end } = req.query;

    const thumb = 'https://files.catbox.moe/dfsc45.jpg';

    // Verificação obrigatória
    if (!nome || !autor || !logo || !end) {
      return res.status(400).send({
        erro: true,
        mensagem: "Campos obrigatórios: nome, autor, logo e end"
      });
    }

    const width = 900;
    const height = 420;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Função para truncar o texto, se necessário
    function truncateText(text, maxWidth, font) {
      const tempCanvas = createCanvas(1, 1);
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.font = font;

      // Verificar o tamanho do texto e truncar se for maior que o limite
      let truncatedText = text;
      while (tempCtx.measureText(truncatedText).width > maxWidth) {
        truncatedText = truncatedText.slice(0, -1);
      }

      return truncatedText + (text !== truncatedText ? '..' : '');
    }

    // Fundo
  const background = await loadImage(thumb);
    ctx.drawImage(background, 0, 0, width, height);

    // Camada escura transparente
    ctx.fillStyle = `rgba(0, 0, 0, 0.5)`;
    ctx.fillRect(0, 0, width, height);

    // Logo com borda arredondada
    const logoImg = await loadImage(logo);
    const logoSize = 180;
    const logoX = 50;
    const logoY = 110;

    ctx.save();
    ctx.beginPath();
    ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    ctx.restore();

// Borda colorida em gradiente RGB (amarelo, rosa, verde, azul)

const grad = ctx.createLinearGradient(logoX, logoY, logoX + logoSize, logoY + logoSize);
grad.addColorStop(0, "yellow");
grad.addColorStop(0.33, "pink");
grad.addColorStop(0.66, "lime");
grad.addColorStop(1, "cyan");

ctx.strokeStyle = grad;
ctx.lineWidth = 4;
ctx.beginPath();
ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
ctx.stroke();

// Caixa cinza escuro transparente atrás de tudo
    const boxX = 250;
    const boxY = 95;
    const boxWidth = 600;
    const boxHeight = 210;

    ctx.fillStyle = "rgba(30, 30, 30, 0.6)";
    const radius = 20;
    ctx.beginPath();
    ctx.moveTo(boxX + radius, boxY);
    ctx.lineTo(boxX + boxWidth - radius, boxY);
    ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + radius);
    ctx.lineTo(boxX + boxWidth, boxY + boxHeight - radius);
    ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - radius, boxY + boxHeight);
    ctx.lineTo(boxX + radius, boxY + boxHeight);
    ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - radius);
    ctx.lineTo(boxX, boxY + radius);
    ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
    ctx.closePath();
    ctx.fill();

    // Ajuste para o título
    const titleFont = "bold 40px Orbitron";
    const maxTitleWidth = boxWidth - 40; // Largura máxima para o título
    const truncatedNome = truncateText(nome, maxTitleWidth, titleFont);

   // Texto: Nome da música em rosa
   ctx.fillStyle = "#ffc0cb"; // Rosa claro, você pode trocar por outro tom se quiser
   ctx.font = titleFont;
   ctx.fillText(truncatedNome, boxX + 20, boxY + 55);


    // Texto: Autor
    const authorFont = "28px Orbitron";
    const maxAuthorWidth = boxWidth - 40; // Largura máxima para o autor
    const truncatedAutor = truncateText(autor, maxAuthorWidth, authorFont);

    ctx.fillStyle = "#ccc";
    ctx.font = authorFont;
    ctx.fillText(truncatedAutor, boxX + 20, boxY + 95);

    // Barra de progresso
    const barX = boxX + 20;
    const barY = boxY + 130;
    const barWidth = boxWidth - 40;
    const barHeight = 14;
    const progresso = 45;

    // Barra base
    ctx.fillStyle = "#888";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Progresso preenchido
    ctx.fillStyle = "#fff";
    ctx.fillRect(barX, barY, (barWidth * progresso) / 100, barHeight);

    // Tempos
    ctx.fillStyle = "#fff";
    ctx.font = "20px Orbitron";
    ctx.fillText("0:45", barX, barY + 40);
    ctx.fillText(end, barX + barWidth - ctx.measureText(end).width, barY + 40);

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
