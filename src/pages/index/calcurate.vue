<template>
  <div class="qycalculator-border">
        <div class="qycalculator-display">
          <div class="qycalculator-qyformula" >{{qyformula}}</div>
          <div class="qycalculator-result" >{{ result }}</div>
        </div>
            
          <div class="qycalculator-items">
          <div class="qycalculator-row-1">
          <div class="qycalculator-item" @click="drop()">←</div>
          <div class="qycalculator-item" @click="cleanResult()">CE</div>
          <div class="qycalculator-item" @click="cleanAll()">C</div>
          <div class="qycalculator-item" @click="toggle()">±</div>
          <div class="qycalculator-item" @click="square()">√</div>
          </div>
                
           <div class="qycalculator-row-2">
          <div class="qycalculator-item" @click="operate(7)">7</div>
          <div class="qycalculator-item" @click="operate(8)">8</div>
          <div class="qycalculator-item" @click="operate(9)">9</div>
          <div class="qycalculator-item" @click="operate('/')">/</div>
          <div class="qycalculator-item" @click="operate('%')">%</div>
          </div>

          <div class="qycalculator-row-3">
          <div class="qycalculator-item" @click="operate(4)">4</div>
          <div class="qycalculator-item" @click="operate(5)">5</div>
          <div class="qycalculator-item" @click="operate(6)">6</div>
          <div class="qycalculator-item" @click="operate('*')">*</div>
          <div class="qycalculator-item" @click="devided()">1/x</div>
          </div>
                
          <div class="qycalculator-row-4">
          <div class="qycalculator-item" @click="operate(1)">1</div>
          <div class="qycalculator-item" @click="operate(2)">2</div>
          <div class="qycalculator-item" @click="operate(3)">3</div>
          <div class="qycalculator-item" @click="operate('-')">-</div>
          <div class="qycalculator-item" @click="operate('+')">+</div>
          </div>
                
          <div class="qycalculator-row-5">
          <div class="qycalculator-item" @click="operate(0)">0</div>
          <div class="qycalculator-item" @click="operate('.')">.</div>
          <div class="qycalculator-item" @click="equal()">=</div>
          </div>
        </div>
      </div>
</template>

<script>
import "./calc.css"
import { Interpreter } from "eval5";

export default {
  data () {
    return {
     qyformula :"",
     result : 0 ,
     interpreter:'',
    }
  },
  mounted() {
    const interpreter = new Interpreter(window, {
      timeout: 1000,
    });
    this.interpreter = interpreter;
    console.log("interpreter",this.interpreter)
  },
  methods:{
    operate(element){
      console.log("operate..");
      this.qyformula +=element;
      console.log("this.qyformula:");
      // console.log(this.qyformula);
    },
    equal(){
      console.log("equal..");
      this.result = this.interpreter.evaluate(this.qyformula);
      // console.log("this.qyformula:");
      // console.log(this.qyformula);
    },
    cleanResult(){
      console.log("cleanResult..");
      this.result = 0;
    },
    cleanAll(){
      console.log("cleanAll..");
      this.qyformula = "";
      this.result = 0;
    },
    drop(){
        console.log("drop..");
        this.qyformula = this.qyformula.slice(0, -1);
    },
    square(){
        console.log("square..");
        console.log(this.interpreter.evaluate(this.qyformula));
        this.interpreter.evaluate(this.qyformula)<0? this.qyformula = "Can not suqre the negative value" : this.result=Math.sqrt(interpreter.evaluate5(this.qyformula));
   },
   devided(){
        console.log("devided.."); 
        this.qyformula===""||this.qyformula.endsWith("+"||"-"||"*"||"/"||"%")? {} :  this.qyformula="1/("+this.qyformula+")";this.equal();
   },
   toggle(){
        console.log("toggle.."); 
        this.qyformula===""||this.qyformula.endsWith("+"||"-"||"*"||"/"||"%")? {} :  this.qyformula.startsWith("-")?this.qyformula = Math.abs(interpreter.evaluate5(this.qyformula)).toString(): this.qyformula="-("+this.qyformula+")";
        this.equal();
   }
 }
}
</script>

<style scoped>

</style>