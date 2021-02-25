# hansejc.github.io
Hobby website I use to simplify my life

<header id="dobble"><hr>
	<h1>Dobble</h1>
</header>
<div class="row 50%">
	<p> This game can be played by one or two players. You can only get a high score in one player mode. Try to find a matching symbol
		between the reference and player card. Every card has one match. Click on the match to gain a point and receive a new card. 
		If you click on the wrong match, one point will be deducted. This is to avoid cheating by spamming click. The math used to create this game
		can be found <a href="https://www.petercollingridge.co.uk/blog/mathematics-toys-and-games/dobble/">here</a>.
	</p>
</div>
<header id="csv"><hr>
	<h1>CSV Plotter</h1>
</header>
<div class="row 50%">
	<p> There are two modes, "Process Upload" and "CSV Formatted". The default mode is to process the upload. This converts all the csv information
		into an array. All text is removed from the array. If empty spaces are needed, make sure to write "null" in the csv. Everything other than numbers
		is removed when processing the data. Rolling averages can be used by entering a number in the input box that appears while hovering. 
		<br><br>The Start date option can be used to create an x axis with custom dates. The rate can be chosen to match the 
		original dates in the csv. The original dates usually don't survive the processing, due to so many different formats existing for dates. 
		<br><br>The enable equations options is used for data manipulation. Every column of data is represented by a letter. The default shows just the letters, "a", "b", "c", etc.
		Equations can be applied to individual columns. For example "a*b" will multiply the first two columns. Any form of javascript math can be applied to
		the columns. For more information about javascript equations see <a href="https://www.w3schools.com/js/js_math.asp">here</a>.
	<br><br> When using "CSV Formatted":<br>
		For the csv file to load correctly, delete all unneeded rows and columns. The first row can be left to be used as labels. The other rows
		have to only contain numbers to work. All columns must be the same width.
	</p>
</div>
<header id="relay"><hr>
	<h1>Distance Protection Fault Plotter</h1>
</header>
<div class="row 50%">
	<p>	Using Easergy / S1 Agile, open the disturbance record data. Go to "Files" > "Save As" > "CSV Format" > "Vector Values (RMS & Ang)". 
		For the csv file to load correctly, delete all unneeded rows and columns containing letters. The uploaded csv file must only contain 
		four columns of data with no labels. The first column must contain the "Vcat-RMS" data, the second column the "Vcat-Ang",  
		the third column the "Icat-RMS" data, and the fourth column the "Icat-Ang".<br><br>
		To plot secondary values to primary values, select the secondary radio button and input the VT and CT ratios in the advanced section.
		Some relay disturbance record display and export the records using secondary values. If this is the case, select the secondary DR 
		radio button. The fault sample time can be used to calculate in what zone the relay tripped. The default sample time is of 1 ms, but
		other sample times are also used. The sample time can be found in the disturbance record data.
	</p>
</div>
<header id="earth"><hr>
	<h1>Earthing Calculation Tools</h1>
</header>
<div class="row 50%">
	<p>	The calculations used for this page have been extracted from <a href="http://www.dcode.org.uk/assets/uploads/ENA_ER_S34_Issue_2__2018_.pdf">Engineering Recommendation EREC S34</a> and 
		<a href="https://www.ena-eng.org/ENA-Docs/D0C3D1R/TS_41-24_181106101835.pdf">Technical Specification 41-24</a>.
	</p>
</div>
<header id="soil"><hr>
	<h1>Earthing Surveys</h1>
</header>
<div class="row 50%">
	<p>	This page can be used to document the results of Soil Resistivity and Fall of Potential surveys. Enter the test location to save 
		the results with the specified site name. <br><br>
		<b>Soil Resistivity</b><br>
		Enter the soil resistance values and check that the soil resistivity values are consistent.
		Soil resistivity can be tested using the Wenner test as described in section 10.2.2 of BS 7430 and below. 
		Drive four equally spaced test electrodes to a depth of not greater 5% of their spacing apart. 
		Pass current between the two outer electrodes. Measure the earth potential between the two inner electrodes.
		The resistance R should be taken as the ratio of the voltage between the inner electrodes and the current between the outer electrodes. 
		In homogenous soil the average resistivity ρ in ohm metres (Ωm) may be taken as: <b>ρ = 2π a R</b>. 
		<br><br>Where:<br>
		a is the spacing between electrodes, in metres (m)<br>
		R is the resistance measured between the middle electrodes, in ohms (Ω)<br><br>
		See the figure below to get a better idea.<br>
		<img class="helpImg" src="images/soil-resistivity.svg" style="max-width:600px; width:100%; display: block; margin-left: auto; margin-right: auto;"/>
		<br><br><b>Fall of Potential</b><br>
		The outer test electrode, or current test stake, is driven into the ground 30 to 50 metres away from the earth system, 
		and the inner electrode, or voltage test stake, is then driven into the ground mid-way between the earth electrode and the current 
		test stake, and in a direct line between them.<br><br>
		The Fall of Potential method can be adapted slightly for use with medium sized earthing systems. This adaptation is often referred to as the 62% Method,
		as it involves positioning the inner test stake at 62% of the earth electrode-to-outer stake separation. When using this method, it is also advisable to 
		repeat the measurements with the inner test stake moved ±10% of the earth electrode-inner test stake separation distance. If these two additional 
		measurements are in agreement with the original measurement, within the required level of accuracy, then the test stakes have been correctly positioned 
		and the DC resistance figure can be obtained by averaging the three results. There is a label which shows if the results of the 62% test are valid or not.
		See the figure below to get a better idea.
		<img class="helpImg" src="images/fall-of-potential.svg" style="max-width:400px; width:100%; display: block; margin-left: auto; margin-right: auto;"/>
	</p>
</div>
<header id="tools"><hr>
	<h1>Electrical Engineering Tools</h1>
</header>
<div class="row 50%">
	<p><a href="downloads/Polar Addition.xlsx">Polar Additions</a>
	</p>
</div>	
<header id="fault"><hr>
	<h1>Railway Faults</h1>
</header>
<div class="row 50%">
	<p> The railway faults page was put together using a bunch of made of equations and basic electrical engineering principles. The following variables were used
		for the calculations:
	</p>
	<ul style="padding: 0 0 0 3em; list-style-type: none; zoom:1; line-height:1.6em">
		<li>I<sub>F</sub></li>
		<li>I<sub>S</sub></li>
		<li>K<sub>RR</sub></li>
		<li>K<sub>T</sub></li>
		<br>
		<li>L<sub>BT</sub></li>
		<li>L<sub>C</sub></li>
		<li>L<sub>S</sub></li>
		<li>L<sub>XB</sub></li>
		<br>
		<li>L<sub>XBP</sub></li>
		<li>V<sub>S</sub></li>
		<li>Z<sub>AEW</sub>	</li>
		<li>Z<sub>ATF</sub></li>
		<li>Z<sub>BT</sub></li>
		<li>Z<sub>CAT</sub></li>
		<li>Z<sub>CW</sub></li>
		<li>Z<sub>DEP</sub></li>
		<li>Z<sub>F</sub></li>
		<li>Z<sub>OLE</sub></li>
		<li>Z<sub>R</sub></li>
		<li>Z<sub>RET</sub></li>
		<li>Z<sub>RSC</sub></li>
		<li>Z<sub>S</sub></li>
		<li>Z<sub>T</sub></li>
	</ul>	
	<ul style="padding: 0 0 0 1em; list-style-type: none; zoom:1; line-height:1.6em">
		<li>Fault Current </li>
		<li>Source Fault Current </li>
		<li>1 for single rail return, 2 for DRR</li>
		<li>Number of tracks minus 1</li>
		<li>(If one track, this is set to infinite)</li>
		<li>Distance Between BTs</li>
		<li>Current Location</li>
		<li>Distance between substations</li>
		<li>Cross Bonding Distance</li>
		<li>(if L<sub>XB</sub> = 0 or L<sub>XB</sub> > LL<sub>S</sub> then L<sub>XB</sub> is set to L<sub>S</sub>)</li>
		<li>Distance since last Cross Bond</li>
		<li>System Voltage</li>
		<li>AEW Impedance</li>
		<li>ATF Impedance</li>
		<li>BT Impedance</li>
		<li>Catenary Impedance</li>
		<li>Contact Wire Impedance</li>
		<li>Departing Impedance</li>
		<li>Fault Impedance</li>
		<li>ZCAT // ZCW</li>
		<li>Rail Impedance</li>
		<li>Return Impedance</li>
		<li>RSC Impedance</li>
		<li>Source Impedance</li>
		<li>Telecoms Impedance</li>
	</ul>
	<p>
		Source Impedance:<br>
		$$ Z_S = {V_S \over I_S} $$
		
		OLE Impedance:<br>
		$$ Z_{OLE} = \left({1 \over Z_{CAT}} + {1 \over Z_{CW}}\right)^{-1} $$
		
		<br>Depart Impedance (OLE impedance to fault):<br>
		$$ {Z_{DEP} =} \left({1 \over Z_{OLE} \times L_C} + \left({Z_{OLE} \times L_S \over K_T} + Z_{OLE} \times (L_S - L_C) \right)^{-1} \right)^{-1} $$
		
		<br>The current location (L<sub>C</sub>) is reset to 0 at each substation. The distance between the substation (L<sub>S</sub>) changes after each substation. The impedance once 
		the current location (L<sub>C</sub>) reaches the substation distance (L<sub>S</sub>) is added to the impedance of the next calculated section.<br><br>
		
		Return Impedance:<br>
		$$ {Z_{RET} =} \left({1 \over Z_R \times L_{XBP}} + \left( \left({K_{RR} \times K_T \over Z_R \times L_{XB}} + {1 \over Z_{AEW} \times L_{XB}} + {1 \over Z_{RSC} \times L_{XB}} \right)^{-1} + Z_R \times (L_{XBP} - L_{XB}) \right)^{-1} \right)^{-1} $$
		
		<br>The distance since last cross bond (L<sub>XBP</sub>) is reset to 0 at each cross bond. The impedance once the distance since last cross bond (L<sub>XBP</sub>)
		reaches the cross bond distance (L<sub>XBP</sub>) is added to the impedance of the next calculated section.<br><br>
		
		Fault Impedance:<br>
		$$ Z_F = Z_{DEP} + Z_{RET} + Z_S $$
		
		Fault Current:<br>
		$$ I_F = {V_S \over Z_F}  $$
	</p>
</div>
