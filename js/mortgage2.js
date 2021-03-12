function firstMortgage(info){
  const ir = 4.09/12/100; //initial interest rate
  let {teq,mortgage,rl,tpa} = info;
  for (let i = 0; i < 13; i++) { //first year
    let intr = rl*ir; //interest
    let eqp = 1000-intr; //equity payment
    teq += eqp;
    mortgage.push([new Date(2017,3+i,1), intr, eqp, intr+eqp]); //start of mortgage
    rl = rl-eqp;
    tpa +=1000;
  }
  for (let i = 0; i < 11; i++) { // changed overpayment to £1100
    let intr = rl*ir;
    let eqp = 1100-intr;
    teq += eqp;
    mortgage.push([new Date(2018,4+i,1), intr, eqp, intr+eqp]);
    rl = rl-eqp;
    tpa +=1100;
  }
  return {teq,mortgage,rl,tpa};
}

function secondMortgage(info){
  let today = new Date();
  const ir = 1.84/12/100; //remortgage rate
  let {teq,mortgage,rl,tpa} = info;
  let intr = rl*ir;
  let eqp = 1100-intr-995; //the 995 was te remortgage fee
  teq += eqp;
  mortgage.push([new Date(2019,3,1), intr, eqp, intr+eqp]);
  rl = rl-eqp;
  tpa += 1100;
  for (let i = 0; i < 14; i++) { // changed overpayment to £1200
    intr = rl*ir;
    eqp = 1200-intr;
    teq += eqp;
    mortgage.push([new Date(2019,4+i,1), intr, eqp, intr+eqp]);
    rl = rl-eqp;
    tpa +=1200;
  }
  for (let i = 0; i < 9; i++) { // changed overpayment to £1500
    intr = rl*ir;
    eqp = 1500-intr;
    teq += eqp;
    mortgage.push([new Date(2020,6+i,1), intr, eqp, intr+eqp]);
    rl = rl-eqp;
    tpa +=1500;
  }
  return {teq,mortgage,rl,tpa};
}

function currentMortgage(info){
  let today = new Date();
  const monthd = (today-new Date(2021,3,1))/1000/60/60/24/365.25*12; //difference in month
  const ir = 1.59/12/100; //remortgage rate
  let {teq,mortgage,rl,tpa} = info;
  let intr = rl*ir;
  let eqp = 459.89-intr+5814.12+250-66; //the 5748 was the shortfall since we borrowed £135k, the £250 is cashback, £66 fees
  teq += eqp;
  mortgage.push([new Date(2021,3,1), intr, eqp, intr+eqp]);
  rl = rl-eqp;
  tpa += 459.89;
  for (let i = 0; i < monthd; i++) { // changed overpayment to £1500
    intr = rl*ir;
    eqp = 1500-intr;
    teq += eqp;
    mortgage.push([new Date(2021,4+i,1), intr, eqp, intr+eqp]);
    rl = rl-eqp;
    tpa +=1500;
  }
  return {teq,mortgage,rl,tpa,monthd};
}

function futureMortgage(info){
  let {intr,eqp,mortgage,rl,tp} = info;
  let pn = 0; //payment number
  const ir = 1.59/12/100; //remortgage rate
  var start = 0; var max = 10000;
  for (let i = 0; rl > 0; i++) {
    intr = rl*ir;
    eqp = tp-intr;
    mortgage.push([new Date(2021,5+i+monthd,1), intr, eqp, intr+eqp]);
    rl = rl-eqp;
    pn++;
    start+=1;if(start>max)break;
  }
  return pn;
}

function calculations(){
  const il = 176225; //initial loan
  let mortgage = [];
  let rl, teq, ltv, tpa; //remaining loan, total equity, total payed
  const mpc = 459.89;  //current mortgage payment
  var op = Number(getSavedValue("OP"));
  var tp = op+mpc; // total payment

  document.getElementById("HPI").value = getSavedValue("HPI");    // set the value to this input
  document.getElementById("OP").value = getSavedValue("OP");
  let hpi = Number(getSavedValue("HPI"));    // set the value to this input
  if (hpi < 100000) hpi = il + 9275;
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