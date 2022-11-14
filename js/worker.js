onmessage = (mess) => {
	const csv = mess.data[0];
	
	if (mess.data[3]) {
		for (let i=0;i<csv.length;i++){		
			for (let j=1;j<csv[i].length;j++){	
				eval("let "+ String.fromCharCode(96+j)+"= csv[i][j]");
				//window[String.fromCharCode(96+j)] = csv[i][j];
			}
			for (let j=1;j<csv[i].length;j++){	
				csv[i][j] = eval(mess.data[1][j-1]);
				
			}
		}
	}
	//close();
	postMessage(csv);
};