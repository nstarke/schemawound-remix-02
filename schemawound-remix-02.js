//"The Same Color As Your Skin (Extended)" by Schemawound
//Original by Jonathan Siesmasko (schemawound@yahoo.com) - Soundcloud: http://soundcloud.com/schemawound
//Remix by Nicholas Starke (nstarke_07@yahoo.com) - Soundcloud: http://soundcloud.com/nicholas-starke
//Requires Audiolet (https://github.com/oampo/Audiolet)

var SchemawoundRemix02 = function(seconds){
	var synth = null;
	var audiolet = new Audiolet()
	, Synth = function(audiolet, seconds){
		AudioletGroup.apply(this, [audiolet, 0, 1]);
		
		//create osc nodes
		this.saw = new Saw(audiolet);
		this.pulse = new Pulse(audiolet);
		this.envelope1 = new Envelope(audiolet, 1, [1, 0], [seconds], 1, 
			function(){
				audiolet.scheduler.addRelative(0,this.remove.bind(this));
          }.bind(this));
        this.envelope1MulAdd = new MulAdd(audiolet, 390, 210);
		this.envelope2 = new Envelope(audiolet, 1, [0, 1], [seconds], 1,
			function(){
				audiolet.scheduler.addRelative(0, this.remove.bind(this));
          }.bind(this));
        this.envelope2MulAdd = new MulAdd(audiolet, 110, 100);
        this.multiply = new Multiply(audiolet);
        
        //connect osc nodes
		this.envelope1.connect(this.envelope1MulAdd);
		this.envelope2.connect(this.envelope2MulAdd);
		this.envelope1MulAdd.connect(this.saw);
		this.envelope2MulAdd.connect(this.pulse);
		this.saw.connect(this.multiply);
		this.pulse.connect(this.multiply, 0, 1);
		
		//create lpf filter nodes
		this.lpfLineLFO = new Sine(audiolet, 0.2);
		this.lpfLineEnvelope = new Envelope(audiolet, 1, [0, 1], [seconds], 1, 
			function(){
				audiolet.scheduler.addRelative(0, this.remove.bind(this));
          }.bind(this));
		this.lpfLineEnvelopeMulAdd = new MulAdd(audiolet, 9800, 200);
		this.lpfLineMultiply = new Multiply(audiolet);
		this.lpfLFO = new Sine(audiolet, 0.4);
		this.lpf = new LowPassFilter(audiolet);
		this.lpfMultiply = new Multiply(audiolet, 1);
		this.lpfTanh = new Tanh(audiolet);
		
		//connect lpf filter nodes
		this.lpfLineEnvelope.connect(this.lpfLineEnvelopeMulAdd);
		this.lpfLineEnvelopeMulAdd.connect(this.lpfLineMultiply);
		this.lpfLineLFO.connect(this.lpfLineMultiply, 0, 1);
		this.lpfLFOMulAdd = new MulAdd(audiolet, this.lpfLineMultiply.output, 60);
		this.lpfLFO.connect(this.lpfLFOMulAdd);
		this.lpfLFOMulAdd.connect(this.lpf, 0, 1);
		this.multiply.connect(this.lpf);
		this.lpf.connect(this.lpfTanh)
		this.lpfTanh.connect(this.lpfMultiply);
		
		//create hpf filter nodes
		this.hpfLineLFO = new Sine(audiolet, 0.2);
		this.hpfLineEnvelope = new Envelope(audiolet, 1, [0, 1], [seconds], 1, 
			function(){
				audiolet.scheduler.addRelative(0, this.remove.bind(this));
          }.bind(this));
		this.hpfLineEnvelopeMulAdd = new MulAdd(audiolet, 7000, 3000);
		this.hpfLineMultiply = new Multiply(audiolet);
		this.hpfLFO = new Sine(audiolet, 0.4);
		this.hpf = new HighPassFilter(audiolet);
		this.hpfMultiply = new Multiply(audiolet, 1);
		this.hpfTanh = new Tanh(audiolet);
		
		//connect hpf filter nodes
		this.hpfLineEnvelope.connect(this.hpfLineEnvelopeMulAdd);
		this.hpfLineEnvelopeMulAdd.connect(this.hpfLineMultiply);
		this.hpfLineLFO.connect(this.hpfLineMultiply, 0, 1);
		this.hpfLFOMulAdd = new MulAdd(audiolet, this.hpfLineMultiply.output, 60);
		this.hpfLFO.connect(this.hpfLFOMulAdd);
		this.hpfLFOMulAdd.connect(this.hpf, 0, 1);
		this.multiply.connect(this.hpf);
		this.hpf.connect(this.hpfTanh)
		this.hpfTanh.connect(this.hpfMultiply);
		
		//create lpf comb nodes
		this.comb1Lpf = new CombFilter(audiolet, 1,0.3,1);
		this.comb1MultiplyLpf = new Multiply(audiolet, 1);
		this.comb2Lpf = new CombFilter(audiolet, 1, 1, 6);
		this.comb2MultiplyLpf = new Multiply(audiolet, 1);
		this.hpfMultiplyLpf = new Multiply(audiolet, 1);
		this.gainLpf = new Gain(audiolet, 7);
		this.combTanhLpf = new Tanh(audiolet);
		
		//connect lpf comb nodes
		this.lpfMultiply.connect(this.comb1Lpf);
		this.comb1Lpf.connect(this.comb1MultiplyLpf);
		this.lpfMultiply.connect(this.comb2Lpf);
		this.comb2Lpf.connect(this.comb2MultiplyLpf);
		this.comb2AddLpf = new Add(audiolet, this.comb1multiplyLpf);
		this.comb2MultiplyLpf.connect(this.comb2AddLpf);
		this.comb2AddLpf.connect(this.combTanhLpf);
		this.combTanhLpf.connect(this.gainLpf);
		
		//create hpf comb nodes
		this.comb1Hpf = new CombFilter(audiolet, 1,0.3,1);
		this.comb1MultiplyHpf = new Multiply(audiolet, 1);
		this.comb2Hpf = new CombFilter(audiolet, 1, 1, 6);
		this.comb2MultiplyHpf = new Multiply(audiolet, 1);
		this.hpfCombLpf = new LowPassFilter(audiolet, 5000);
		this.gainHpf = new Gain(audiolet, 0.01);
		this.combTanhHpf = new Tanh(audiolet);
		
		//connect hpf comb nodes
		this.hpfMultiply.connect(this.comb1Hpf);
		this.comb1Hpf.connect(this.comb1MultiplyHpf);
		this.hpfMultiply.connect(this.comb2Hpf);
		this.comb2Hpf.connect(this.comb2MultiplyHpf);
		this.comb2AddHpf = new Add(audiolet, this.comb1multiplyHpf);
		this.comb2MultiplyHpf.connect(this.comb2AddHpf);
		this.comb2AddHpf.connect(this.combTanhHpf);
		this.combTanhHpf.connect(this.hpfCombLpf);
		this.hpfCombLpf.connect(this.gainHpf);
		
		//final mix
		this.mixergain = new Gain(audiolet, 0.5);
		this.mixerhpf = new HighPassFilter(audiolet, 20);
		this.gainHpf.connect(this.mixergain);
		this.gainLpf.connect(this.mixergain);
		this.mixergain.connect(this.mixerhpf);
		this.mixerhpf.connect(this.outputs[0]);
		
	}
	extend(Synth, AudioletGroup);
	this.play = function(){
		synth = new Synth(audiolet, seconds);
		synth.connect(audiolet.output);
	},
	this.stop = function(){
		synth.disconnect(audiolet.output);
	}
}
