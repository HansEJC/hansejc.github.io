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

function firstMortgage(info){
  const ir = 4.09/12/100; //initial interest rate
  let {teq,mortgage,rl,tpa} = info;
  let loopInfo = {num: 13, pay: 1000, year: 2017, month: 3,ir,...info};
  info = {teq,mortgage,rl,tpa} = mortgageLoop(loopInfo);  
  
  loopInfo = {num: 11, pay: 1100, year: 2018, month: 4,ir,...info}; // changed overpayment to £1100
  return mortgageLoop(loopInfo);
}

function secondMortgage(info){
  let today = new Date();
  const ir = 1.84/12/100; //remortgage rate
  let {teq,mortgage,rl,tpa} = info;
  
  let pay = 1100-995; //the 995 was te remortgage fee
  let loopInfo = {num: 1, pay, year: 2019, month: 3,ir,...info}; // First month
  info = {teq,mortgage,rl,tpa} = mortgageLoop(loopInfo);

  loopInfo = {num: 14, pay: 1200, year: 2019, month: 4,ir,...info}; // changed overpayment to £1200
  info = {teq,mortgage,rl,tpa} = mortgageLoop(loopInfo);

  loopInfo = {num: 9, pay: 1500, year: 2020, month: 6,ir,...info}; // changed overpayment to £1500
  return mortgageLoop(loopInfo);
}

function currentMortgage(info){
  let today = new Date();
  const monthd = (today-new Date(2021,3,1))/1000/60/60/24/365.25*12; //difference in month
  const ir = 1.59/12/100; //remortgage rate
  let {teq,mortgage,rl,tpa} = info;

  let pay = 459.89+5814.12+250-66; //the £5814.12 was the shortfall since we borrowed £135k, the £250 is cashback, £66 fees
  let loopInfo = {num: 1, pay, year: 2021, month: 3,ir,...info}; // First month
  info = {teq,mortgage,rl,tpa} = mortgageLoop(loopInfo);
  
  loopInfo = {num: monthd, pay: 1500, year: 2021, month: 4,ir,...info}; // changed overpayment to £1500
  return {monthd,...mortgageLoop(loopInfo)};
}

function futureMortgage(info){
  let {intr,eqp,mortgage,rl,tp} = info;
  let pn = 0; //payment number
  const ir = 1.59/12/100; //remortgage rate
  for (let i = 0; rl > 0; i++) {
    intr = rl*ir;
    eqp = tp-intr;
    mortgage.push([new Date(2021,5+i+monthd,1), intr, eqp, intr+eqp]);
    rl = rl-eqp;
    pn++;
  }
  return pn;
}

function calculations(){
  const il = 176225; //initial loan
  let mortgage = [];
  let rl, teq, ltv, tpa; //remaining loan, total equity, total payed
  const mpc = 459.89;  //current mortgage payment
  var op = +(getSavedValue("OP"));
  var tp = op+mpc; // total payment

  document.getElementById("HPI").value = getSavedValue("HPI");    // set the value to this input
  document.getElementById("OP").value = getSavedValue("OP");
  let hpi = Math.max(il + 9275, +(getSavedValue("HPI")));    // set the value to this input
  teq = hpi - il; //initial deposit plus HPI
  rl = il; tpa = 0;

  let info = {teq,mortgage,rl,tpa,tp};
  info = firstMortgage(info);
  info = secondMortgage(info);
  info = {monthd,tpa,rl,teq} = currentMortgage(info);  
  let pn = futureMortgage({tp,...info});

  ltv = 100 - teq / (teq + rl) * 100;

  spanToMoney("TPA",tpa);
  spanToMoney("TEQ",teq);
  spanToMoney("MPN",mpc);
  spanToMoney("TP",tp);
  spanToMoney("RD",rl);
  spanToMoney("MOP",rl/120);
  document.getElementById("LTV").textContent = ltv.toFixed(0)+" %";

  if ((rl/120)<op) document.getElementById("MOP").className = 'label danger';
  else document.getElementById("MOP").className = 'label safe';

  document.getElementById("RT").textContent = Math.floor((pn)/12)+" y " + (12*((pn)/12-Math.floor(pn/12))).toFixed(0)+" m";
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
            return  y + ' £';
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

const spanToMoney = (span,cont) => document.getElementById(span).textContent = (cont).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")+" £";

//startup
calculations();
document.onkeyup = function() {
  calculations();
};