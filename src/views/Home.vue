<template>
  <div class="home">
    <img alt="Madx logo" src="../assets/logo.png">
    <h5>Words</h5>
    <Textarea v-model="words" :auto-resize="true" rows="20" cols="20" />
    <h5>Field</h5>
    <Textarea v-model="field" :auto-resize="true" rows="20" cols="40" />
    <br>
    <br>
    <Button label="Solve" @click="solve()" />
    <br>
    <br>
    <canvas ref="canvas" style="border: 1px solid black;" :width="canvasDimensions[1]" :height="canvasDimensions[0]"></canvas>
  </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue } from "vue-property-decorator";

const FIELDS = [
  "4770586607424893156454",
  "5241898655215408208590",
  "5460681710067828376830",
  "6185806636659146258844",
  "8855563271479005185404",
  "0421357630695677647063",
  "6006507412749151390562",
  "8097423973211398456888",
  "3259450738576210847938",
  "9084345382889490973447",
  "9858947162741075348876",
  "4465106672789324675746",
  "1867928310294357545213",
  "4868887933170123892606",
];

const INITIAL_WORDS = [
  "1066727",
  "3022283",
  "5067519",
  "6264973",
  "7467765",
  "8662519",
  "1382976",
  "3259450",
  "5163557",
  "6278498",
  "7474594",
  "8679283",
  "1487239",
  "3538684",
  "5284054",
  "6475764",
  "7475370",
  "8688879",
  "1515203",
  "3799128",
  "5401904",
  "6496965",
  "7480126",
  "8823440",
  "1627410",
  "3866043",
  "5457534",
  "6601564",
  "7545213",
  "9084345",
  "1701238",
  "3886571",
  "5485303",
  "6753124",
  "7591972",
  "9409099",
  "1707619",
  "4004432",
  "5565175",
  "6826455",
  "8020048",
  "9498828",
  "1752784",
  "4074476",
  "5649523",
  "7160361",
  "8065025",
  "9566366",
  "1961959",
  "4265557",
  "5711782",
  "7164745",
  "8283768",
  "9580280",
  "2108479",
  "4426140",
  "5849761",
  "7186064",
  "8344170",
  "9835506",
  "2154082",
  "4453586",
  "5887871",
  "7218828",
  "8376075",
  "9845688",
  "2165794",
  "4556806",
  "5902586",
  "7244541",
  "8405894",
  "9858947",
  "2326880",
  "4625884",
  "5921461",
  "7303584",
  "8436123",
  "9934633",
  "2467574",
  "4706685",
  "6036069",
  "7317386",
  "8481061",
  "2594656",
  "4768047",
  "6062983",
  "7382876",
  "8520958",
  "2767601",
  "4889407",
  "6164993",
  "7437085",
  "8527646",
  "2814183",
  "4915139",
  "6192947",
  "7443790",
  "8608655",
];

interface Dir {
  dx: number
  dy: number
}

interface Result extends Dir{
  x: number
  y: number
  word: string
}


const SIZE = 30
const OFFSET_WORD_X = 11
const OFFSET_WORD_Y = 22

export default class Home extends Vue {
  words: string = INITIAL_WORDS.join("\n");
  field: string = FIELDS.join("\n");
  canvasDimensions: number[] = [200, 400];

  // Notice how everything is y,x instead of x,y due to the way we split the input

  f: string[][]
  w: string[]

  solve() {

    this.f = this.field.split("\n").map((line) => line.trim().split(""))
    this.canvasDimensions = [this.f.length * SIZE, this.f[0].length * SIZE]
    this.w = this.words.split("\n")
    // console.table(this.f);
    // console.log(this.w);

    const result: Result[] = []

    for(const word of this.w){
      const res = this.findWord(word)
      if(res) {
        // console.log(`Found: ${word} at [${res.x}, ${res.word}]`)
      } else {
        return alert('Word not found: ' + word)
      }
      result.push(res)
    }

    this.draw(result)
  }

  draw(result: Result[]) {

    console.log(result)
    const ctx = (this.$refs.canvas as any).getContext('2d');
    ctx.font = '18px serif';

    for(let y = 0; y < this.f.length; y++){
      for(let x = 0; x < this.f[y].length; x++){
        ctx.fillText(this.f[y][x], x * SIZE + OFFSET_WORD_X, y * SIZE + OFFSET_WORD_Y);   
      }
    }

    const r = this.f.map((e) => e.map(() => true))

    for(let res of result){
      const xStart = res.x
      const yStart = res.y
      const xEnd = res.x + res.dx * (res.word.length-1)
      const yEnd = res.y + res.dy * (res.word.length-1)
      const lineOffset = SIZE / 2
      ctx.beginPath();
      ctx.moveTo(xStart * SIZE + lineOffset, yStart * SIZE + lineOffset);
      ctx.lineTo(xEnd * SIZE + lineOffset, yEnd * SIZE + lineOffset);
      ctx.stroke();

      for(let i = 0; i < res.word.length; i++){
        r[res.y + res.dy * i][res.x + res.dx * i] = false
      }
    }
    ctx.strokeStyle = 'red'
    for(let y = 0; y < r.length; y++){
      for(let x = 0; x < r[y].length; x++){
        if(r[y][x]){
          ctx.beginPath();
          ctx.arc(x * SIZE + SIZE/2, y * SIZE + SIZE/2, 14, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    }
  }

  findWord(word: string): Result {

    const directions = [
      { dy: 0 , dx:  1 },
      { dy: 0 , dx: -1 },
      { dy: 1 , dx:  0 },
      { dy: 1 , dx:  1 },
      { dy: 1 , dx: -1 },
      { dy: -1, dx:  0 },
      { dy: -1, dx:  1 },
      { dy: -1, dx: -1 },
    ]

    for(const dir of directions){
      const res = this.checkDirection(dir, word)
      if(res) return res
    }

    return null
  }
  
  checkDirection({dy, dx}: Dir, word: string): Result {
    
    for(let y = 0; y < this.f.length; y++){
      for(let x = 0; x < this.f[y].length; x++){
        let yy = y;
        let xx = x;
        for(let i = 0; i < word.length; i++){

          if(this.f[yy][xx] !== word.charAt(i)){
            break;
          }

          if(i === word.length -1){
            return {dy,dx,x,y,word}
          }

          yy += dy
          if(yy < 0 || yy >= this.f.length){
            break;
          }

          xx += dx
          if(xx < 0 || xx >= this.f[y].length){
            break;
          }
        }
      }
    }
    return null
  }
}
</script>
