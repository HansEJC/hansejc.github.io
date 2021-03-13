function mortgageLoop(loopInfo) {
  let {num,pay,year,month,teq,mortgage,rl,tpa,ir} = loopInfo;
  for (let i = 0; i < num; i++) { // changed overpayment to $pay
    let intr = rl*ir; //interest
    let eqp = pay-intr; //equity payment
    teq += eqp; //total equity
    mortgage.push([new Date(year,month+i,1), intr, eqp, intr+eqp]);
    rl = rl-eqp; //remaining loan
    tpa +=pay; //total payed
  }
  return {teq,mortgage,rl,tpa};
}

function firstMortgage(){
  const il = 176225; //initial loan
  let rl, teq, tpa; //remaining loan, total equity, total payed

  document.getElementById("HPI").value = getSavedValue("HPI");    // set the value to this input
  document.getElementById("OP").value = getSavedValue("OP");
  let hpi = Math.max(il + 9275, +(getSavedValue("HPI")));    // set the value to this input
  teq = hpi - il; //initial deposit plus HPI
  rl = il; tpa = 0;
  
  let mortgage = [];
  const ir = 4.09/12/100; //initial interest rate
  let loopInfo = {num: 13, pay: 1000, year: 2017, month: 3,ir,teq,rl,tpa,mortgage};
  let info = mortgageLoop(loopInfo);  
  
  loopInfo = {num: 11, pay: 1100, year: 2018, month: 4,ir,...info}; // changed overpayment to £1100
  return mortgageLoop(loopInfo);
}

function secondMortgage(info){
  const ir = 1.84/12/100; //remortgage rate  
  let pay = 1100-995; //the 995 was te remortgage fee
  let loopInfo = {num: 1, pay, year: 2019, month: 3,ir,...info}; // First month
  info = mortgageLoop(loopInfo);

  loopInfo = {num: 14, pay: 1200, year: 2019, month: 4,ir,...info}; // changed overpayment to £1200
  info = mortgageLoop(loopInfo);

  loopInfo = {num: 9, pay: 1500, year: 2020, month: 6,ir,...info}; // changed overpayment to £1500
  return mortgageLoop(loopInfo);
}

function currentMortgage(info){
  let today = new Date();
  const monthd = (today-new Date(2021,3,1))/1000/60/60/24/365.25*12; //difference in month
  const ir = 1.59/12/100; //remortgage rate

  let pay = 459.89+5814.12+250-66; //the £5814.12 was the shortfall since we borrowed £135k, the £250 is cashback, £66 fees
  let loopInfo = {num: 1, pay, year: 2021, month: 3,ir,...info}; // First month
  info = mortgageLoop(loopInfo);
  
  loopInfo = {num: monthd, pay: 1500, year: 2021, month: 4,ir,...info}; // changed overpayment to £1500
  return {monthd,...mortgageLoop(loopInfo)};
}

function futureMortgage(info){
  let {mortgage,rl,tp,monthd} = info;
  let pn = 0; //payment number
  const ir = 1.59/12/100; //remortgage rate
  for (let i = 0; rl > 0; i++) {
    let intr = rl*ir;
    let eqp = tp-intr;
    mortgage.push([new Date(2021,5+i+monthd,1), intr, eqp, intr+eqp]);
    rl = rl-eqp;
    pn++;
  }
  return pn;
}

function calculations(){

  const mpc = 459.89;  //current mortgage payment
  var op = +(getSavedValue("OP"));
  var tp = op+mpc; // total payment
  
  let info = firstMortgage();
  info = secondMortgage(info);
  info = {teq,mortgage,rl,tpa} = currentMortgage(info); 
  let pn = futureMortgage({tp,...info});

  let ltv = 100 - teq / (teq + rl) * 100; //Loan to value
  spanMon("TPA",tpa);
  spanMon("TEQ",teq);
  spanMon("MPN",mpc);
  spanMon("TP",tp);
  spanMon("RD",rl);
  spanMon("MOP",rl/120);
  document.getElementById("LTV").textContent = ltv.toFixed(0)+" %";

  const oplabel = document.getElementById("MOP");
  oplabel.className = ((rl/120)<op) ? `label danger` : `label safe`;
  document.getElementById("RT").textContent = `${Math.floor((pn)/12)} y ${(12*((pn)/12-Math.floor(pn/12))).toFixed(0)} m`;
  dygPlot(mortgage);
}

function dygPlot(mortgage){
  try {
    if (typeof g3 !== 'undefined') g3.destroy();
  }catch(e){console.log(e);}
  g3 = new Dygraph(
    document.getElementById("graphdiv3"),
    mortgage,
    {
      valueRange : [0,2000], //sets default view to £2k
      legend: 'always',
      labels: [ 'Date', 'Interest','Equity', 'Payment'],
      xlabel: "Dates",
      ylabel: "Payments (£)",
      fillGraph: true,
      connectSeparatedPoints: true,
      axes: {
        y: {
          axisLabelFormatter: function(y) {
            return  `${y} £`;
          },
          axisLabelWidth: 60
        }
      }
    }          // options
  );
  setTimeout(function(){
    window.dispatchEvent(new Event('resize'));
  }, 500);
}

const spanMon = (span,cont) => document.getElementById(span).textContent = `${(cont).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}  £`;

//startup
calculations();
document.onkeyup = function() {
  calculations();
};