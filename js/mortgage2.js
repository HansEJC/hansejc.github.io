function firstMortgage(info){
  const sd = new Date(2017,4,1); //start of mortgage
  const iir = 4.09/12/100; //initial interest rate
  let {intr,eqp,teq,mortgage,rl,tpa,tp,pn} = info;
  for (let i = 0; i < 13; i++) { //first year
    intr = rl*iir;
    eqp = 1000-intr;
    teq = teq + eqp;
    mortgage.push([new Date(2017,sd.getMonth()+i,sd.getDay()), intr, eqp, intr+eqp]);
    rl = rl-eqp;
    tpa = tpa +1000;
  }
  for (let i = 0; i < 11; i++) { // changed overpayment to £1100
    intr = rl*iir;
    eqp = 1100-intr;
    teq = teq + eqp;
    mortgage.push([new Date(2018,5+i,1), intr, eqp, intr+eqp]);
    rl = rl-eqp;
    tpa = tpa +1100;
  }
  return {intr,eqp,teq,mortgage,rl,tpa,tp,pn};
}

function secondMortgage(info){
  let today = new Date();
  const monthd = (today-new Date(2020,7,1))/1000/60/60/24/365.25*12; //difference in month
  const nir = 1.84/12/100; //remortgage rate
  let {intr,eqp,teq,mortgage,rl,tpa,tp,pn} = info;
  intr = rl*nir;
  eqp = 1100-intr-995; //the 995 was te remortgage fee
  teq = teq + eqp;
  mortgage.push([new Date(2019,4,1), intr, eqp, intr+eqp]);
  rl = rl-eqp;
  tpa = tpa + 1100;
  for (let i = 0; i < 14; i++) { // changed overpayment to £1200
    intr = rl*nir;
    eqp = 1200-intr;
    teq = teq + eqp;
    mortgage.push([new Date(2019,5+i,1), intr, eqp, intr+eqp]);
    rl = rl-eqp;
    tpa = tpa +1200;
  }
  for (let i = 0; i < monthd; i++) { // changed overpayment to £1500
    intr = rl*nir;
    eqp = 1500-intr;
    teq = teq + eqp;
    mortgage.push([new Date(2020,7+i,1), intr, eqp, intr+eqp]);
    rl = rl-eqp;
    tpa = tpa +1500;
  }
  return {intr,eqp,teq,mortgage,rl,tpa,tp,pn,monthd};
}

function futureMortgage(info){
  let {intr,eqp,teq,mortgage,rl,tpa,tp,pn} = info;
  const nir = 1.84/12/100; //remortgage rate
  var start = 0; var max = 10000;
  for (let i = 0; rl > 0; i++) {
    intr = rl*nir;
    eqp = tp-intr;
    mortgage.push([new Date(2020,8+i+monthd,1), intr, eqp, intr+eqp]);
    rl = rl-eqp;
    pn++;
    start+=1;if(start>max)break;
  }
  return {intr,eqp,mortgage,monthd,tp,pn};
}

function calculations(){
  const il = 176225; //initial loan
  let mortgage = [];
  let intr, eqp, rl, pn, teq, ltv, tpa; //interest, equity payment,remaining loan, payment number, total equity, total payed
  const mpc = 555.07;  //current mortgage payment
  var op = Number(getSavedValue("OP"));
  var tp = op+mpc; // total payment

  document.getElementById("HPI").value = getSavedValue("HPI");    // set the value to this input
  document.getElementById("OP").value = getSavedValue("OP");
  let hpi = Number(getSavedValue("HPI"));    // set the value to this input
  if (hpi < 100000) hpi = il + 9275;
  teq = hpi - il; //initial deposit plus HPI
  rl = il; pn  = tpa = 0;

  let info = {intr,eqp,teq,mortgage,rl,tpa,tp,pn};
  info = firstMortgage(info);
  info = {monthd} = secondMortgage(info);
  ({mortgage,tp,pn} = futureMortgage(info));

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
    if (g3) g3.destroy();
  }catch(e){}
  g3 = new Dygraph(
    document.getElementById("graphdiv3"),
    mortgage,
    {
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