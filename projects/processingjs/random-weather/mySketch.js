var textoCidade;

var api = "https://api.openweathermap.org/data/2.5/weather?";
var lat = "lat=-22.902781";
var long = "&lon=-43.2075";
var chave = "&appid=2107659907d267f0b3ed7440a063d210"; // chave do seu usuario API key
var unidade = "&units=metric"; //opcional por celsius

var pedido = api + lat + long + chave + unidade; // uniao de todos os anteriores para fazermos uma solicitação

let json; // Objeto JSON para receber a resposta do servidor

function preload() {
	json = loadJSON(pedido);
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	//console.log(pedido);

	button = createButton('✈️ 🌎'); //botao para viajar pelo mundo
	button.size(100, 50);
	button.position(300, 50);
	button.style("font-size", "24px");
	button.mousePressed(meuBotao);
}

function draw() {
	background(255);

	//console.log(json);
	if (json.id != 0) { //se o id de cidade for diferente de 0, pega nome da região + bandeira. se for 0 é pq ta no oceano.
		textoCidade = json.name + " " + getFlagEmoji(json.sys.country);
	} else {
		textoCidade = "🌊";
	}

	//escreve o texto de temperatura e local
	textSize(38);
	text(json.main.temp + "ºC", 300, 160);
	textSize(20);
	text("sensação: " + json.main.feels_like + "ºC", 300, 190);
	
	textSize(38);
	text(textoCidade, 300, 250);
	
	textSize(20);
	text("longitude: " + json.coord.lon + " latitude: " + json.coord.lat, 300, 280);
}

function meuBotao() {
	//sorteia latitude e longitude no clique
	var n_lat = random(-90, 90);
	var n_long = random(-180, 180);

	//coloca os valores no formato pro pedido da api
	lat = "lat=" + n_lat;
	long = "&lon=" + n_long;

	var pedido = api + lat + long + chave + unidade;
	//console.log("carregando novos dados lat: " + lat + ", long: " + long);
	loadJSON(pedido, salvaDados); // aqui temos uma função assincrona que realiza a função salvaDados após carregar o json da url
}

// esta função só é executada após o carregamento completo do conteúdo da url do pedido 
// após carregar a url o arquivo, neste caso o json, é passado para dentro da função como o objeto meusDados
// então dizemos que nossa variável global json é igual ao conteúdo carregado da url, no caso meusDados
function salvaDados(meusDados) {
	json = meusDados;
}


//Código que transforma o código de nome de país em Emoji pra tornar a informação de país mais interessante
//Esse pedaço eu copiei daqui https://dev.to/jorik/country-code-to-flag-emoji-a21 
function getFlagEmoji(countryCode) {
	const codePoints = countryCode
		.toUpperCase()
		.split('')
		.map(char => 127397 + char.charCodeAt());
	return String.fromCodePoint(...codePoints);
}