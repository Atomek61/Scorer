class Score {

    constructor() {
      this.A = new Team(this, "A");
      this.B = new Team(this, "B");
      this._color = "red";
      this.onChanged = null;
      this._lastPoints = [0, 0];
      this._swapped = false;
      this._swapping = false;
    }

    doChanged(source) {
      if (this.onChanged)
        this.onChanged(source);
    }

    get color() {
      return this._color;
    }

    set color(value) {
      if (value!=this.color) {
        this._color = value;
        this.doChanged(this);
      }  
    }

    reset() {
      let lastPoints = [this.A.points, this.B.points];
      this.A.points = 0;
      this.B.points = 0;
      this._lastPoints = lastPoints;
    }

    nextColor() {
      if (this.color=="red")
        this.color = "green";
      else if (this.color=="green")
        this.color = "yellow";
      else if (this.color=="yellow")
        this.color = "blue";
      else
        this.color = "red";
    }

    revert() {
      let lastPoints = this._lastPoints;
      let points = [this.A.points, this.B.points];
      [this.A.points, this.B.points] = lastPoints;
      this._lastPoints = points;
    }

    get swapped() {
      return this._swapped;
    }

    set swapped(value) {          
      if (!this._swapping && this.swapped != value) {
        let [A, B] = this._lastPoints;  
        [this.A.points, this.B.points] = [this.B.points, this.A.points];
        this._lastPoints = [B, A];
        this._swapped = value;
      }
    }

    swap(interval) {
      if (!this._swapping) {
        this.swapped = true;
        this._swapping = true;
        setTimeout(()=>{
          this._swapping = false;
          this.swapped = false;
        }, 3000);
      }
    }

  }

  class Team {

    constructor(score, name) {
      this._score = score;
      this._name = name;
      this._points = 0
    };

    get score() {
      return this._score;
    }

    set points(value) {
      if (value>99) value = 99;
      else if (value<0) value = 0;
      if (this.points!=value) {
        this.score._lastPoints = [this.score.A.points, this.score.B.points];
        this._points = value;
        this.score.doChanged(this);
      }
    }

    get points() {
      return this._points;
    }

    set name(value) {
      if (this.name!=value) {
        this._name = value;
        this.score.doChanged(this);
      }
    }

    get name() {
      return this._name;
    }

    inc(n = 1) {
      this.points = this.points + n
    }

    dec(n = 1) {
      if (n>this.points) n = this.points;
      this.points = this.points - n
    }
  }  

  // Encapsulates the Score with its 2 Teams and handles some GUI
  class ScoreGUI {

    constructor(containerId) {
      this.score = new Score();
      this.container = document.getElementById(containerId);         
      this.score.onChanged = (source) => {
        if (source == this.score)
          this.updateDisplay(source);
        else 
          this.updateTeam(source)
      }
      

      this.select("A1").onclick = (event)=>{
        if (event.offsetY<event.target.height / 2)
          this.score.A.inc(10);
        else
          this.score.A.dec(10);
      }

      this.select("A2").onclick = (event)=>{
        if (event.offsetY<event.target.height / 2)
          this.score.A.inc();
        else
          this.score.A.dec();
      }

      this.select("B1").onclick = (event)=>{
        if (event.offsetY<event.target.height / 2)
          this.score.B.inc(10);
        else
          this.score.B.dec(10);
      }

      this.select("B2").onclick = (event)=>{
        if (event.offsetY<event.target.height / 2)
          this.score.B.inc();
        else
          this.score.B.dec();
      }

      this.select("revert").onclick =(event) => {
        this.score.revert();
      }
      this.select("reset").onclick = (event) => {
        this.score.reset();
      }
      this.select("color").onclick = (event) => {
        this.score.nextColor();
      }
      this.select("swap").onclick = (event) => {
        this.score.swap(3000);
      }
      this.select("full").onclick = (event) => {
        this.fullscreen = !this.fullscreen;
      }

      this.container.addEventListener('fullscreenchange', (event) => {
        if (document.fullscreenElement != null)
          this.select("full").style.backgroundImage= "url(img/full2.svg)";
        else
          this.select("full").style.backgroundImage= "url(img/full1.svg)";
      });

      this.updateDisplay();
    }

    get fullscreen() {
      return document.fullscreenElement != null;
    }

    set fullscreen(value) {
      if (value!=this.fullscreen) {
        if (value)
          this.container.requestFullscreen();
        else
          document.exitFullscreen();
      }
    }

    updateTeam(team) {
      let points = team.points % 100
      let d1 = Math.floor(points / 10)
      if (d1==0) d1 = "s"
      let d2 = points % 10
      this.select(team.name+"1").src = "img/"+this.score.color+"."+d1+".svg"       
      this.select(team.name+"2").src = "img/"+this.score.color+"."+d2+".svg"       
    }

    updateDisplay() {
      this.updateTeam(this.score.A);    
      this.select("Dots").src = "img/"+this.score.color+".d.svg";
      this.updateTeam(this.score.B);    
    }

    select(classname) {
      return document.querySelector("#"+this.container.id + " ." + classname);
    }

  }

