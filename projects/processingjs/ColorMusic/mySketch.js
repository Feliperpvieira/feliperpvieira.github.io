//DSG1413 - Objetos Inteligentes 2022.1- Profa Barbara Castro
//Alunos: Felipe Rabaça e Vitor Ourô

var cam; //camera
var corCapturada; //cor capturada no conta gotas
let osc, playing, frequencia, amp; //variaveis do som
let nota; //nome da nota a ser exibido de acordo com cor

//tempos do timer
let tempoAtual = 5;
let tempoLimite;

function setup() {
	let cnv = createCanvas(800, 650);
	cam = createCapture(VIDEO); // Cria a câmera
	cam.size(width, 600); // Configura o tamanho da câmera
	cam.hide();

	background(100);

	//cnv.mousePressed(playOscillator);
	osc = new p5.Oscillator('sine');

	//frameRate();

	//Slider para selecionar o tempo
	slider = createSlider(1, 20, 5, 1); //valores: valor inicial, valor final, valor pre-selecionado, intervalo
	slider.position(480, height+50);
	slider.style('width', '200px');
}

function playOscillator() { //função que toca o som, é chamada no timer
	osc.start();
	playing = true;
}

function mouseReleased() {
	// Dimunui o voume pra 0 com um fade de 0.5 segundos
	osc.amp(0, 0.5);
	playing = false;
}

function draw() {
	background(100);
	
	// As 5 linhas abaixo invertem a câmera horizontalmente
	push();
	translate(width, 0);
	scale(-1, 1)
	image(cam, 0, 0, width, 600);
	pop();
	
	//Timer
	tempoLimite = slider.value(); //Define o intervalo do timer pelo valor do slider
	textSize(24); //Tamanho do texto
	noStroke(); //Sem stroke
	fill(255,255,255); //Cor do texto
	text('Intervalo: ' + tempoLimite + 's', 20, 635); //Texto e valor definido pelo slider
	text('Nota: ' + nota, 500, 635); //Texto com a nota musical

	//Temporizador de fato, aqui a conta é feita
	//Código do timer foi baseado nesse exemplo: https://editor.p5js.org/marynotari/sketches/S1T2ZTMp-
	if (frameCount % 60 == 0 && tempoAtual > 0) { //se o frameCount for divisivel por 60 então 1 segundo passou, a conta para no 0
		mouseReleased();
		tempoAtual--;
		//console.log("tempoooo");
	}
	if (tempoAtual == 0) {
		playOscillator();
		//console.log("tempoooo finaaaaal");
		tempoAtual = tempoLimite; //quando da 0 ele reseta
	}
	//o map iguala o valor do tempoAtual em relação ao intervalo limite pra fazer o circulo girar de 0º a 360º
	let tamArco = map(tempoAtual, 0, tempoLimite, 0, 360); 

// A lupa tem uma posição fixa que pode ser alterada pelo clique do mouse. Ao soltar o mouse ela volta pra posição original.
	let posXlupa = width / 2;
	let posYlupa = height / 2;

	//modifica a posicao da lupa para a posicao do mouse SE a posicao do mouse estiver dentro da camera
	if (mouseIsPressed && mouseY < 600 && mouseY > 0 && mouseX < 800 && mouseX > 0) {
		posXlupa = mouseX;
		posYlupa = mouseY;
	}

	//Desenho da lupa no canvas
	let minhaCor = get(posXlupa, posYlupa); // pega a cor do pixel no centro da lupa
	fill(minhaCor); //Preenche a lupa com a cor
	angleMode(DEGREES); //Muda a unidade de radiano pra graus
	noStroke(); //Remove stroke do circulo de fundo
	arc(posXlupa, posYlupa, 50, 50, 0, 360); //desenha o circulo na cor do minhaCor
	stroke(255); //Desenha o arco que mostra o andamento do timer
	strokeWeight(3);
	arc(posXlupa, posYlupa, 50, 50, 0, tamArco); //desenha o circulo com stroke para mostrar o andamento do timer
	//tamArco é uma variavel definida pelo timer, ela vai reduzindo e mostra visualmente o intervalo
	
	//Definição das cores
	let matiz = int(hue(minhaCor)); //pega a hue (matiz) do minha cor	
	rectMode(CORNER);
	//console.log(minhaCor);
	//console.log(matiz);

	amp = 1
	if (playing) {
		//deixa a transição mais suave com intervalos de .1 segundos
		osc.freq(freq, 0.1);
		osc.amp(amp, 0.1);
	}

	//Os ifs abaixo determinam quais intervalos de cor produzem quais notas
	if (matiz < 30) {
		//console.log("do");
		freq = 264;
		nota = "DO";
	} 
	else if (matiz > 31 && matiz < 60) {
		//console.log("do#");
		freq = 280;
		nota = "DO#";
	} 
	else if (matiz > 61 && matiz < 90) {
		//console.log("re");
		freq = 297;
		nota = "RE";
	} 
	else if (matiz > 91 && matiz < 120) {
		//console.log("re#");
		freq = 314;
		nota = "RE#";
	} 
	else if (matiz > 121 && matiz < 150) {
		//console.log("mi");
		freq = 330;
		nota = "MI";
	} 
	else if (matiz > 151 && matiz < 180) {
		//console.log("fa");
		freq = 350;
		nota = "FA";
	} 
	else if (matiz > 181 && matiz < 210) {
		//console.log("fa#");
		freq = 373
		nota = "FA#";
	} 
	else if (matiz > 211 && matiz < 240) {
		//console.log("sol");
		freq = 396;
		nota = "SOL";
	} 
	else if (matiz > 241 && matiz < 270) {
		//console.log("sol#");
		freq = 419;
		nota = "SOL#";
	} 
	else if (matiz > 271 && matiz < 300) {
		//console.log("la");
		freq = 440;
		nota = "LA";
	} 
	else if (matiz > 301 && matiz < 330) {
		//console.log("la#");
		freq = 470
		nota = "LA#";
	} 
	else if (matiz > 331 && matiz < 360) {
		//console.log("si");
		freq = 495;
		nota = "SI";
	}

	
}