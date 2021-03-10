[![DeepScan grade](https://deepscan.io/api/teams/13094/projects/16113/branches/338723/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=13094&pid=16113&bid=338723)
[![codebeat badge](https://codebeat.co/badges/01f684f9-effc-4599-bc60-8706d5a4d3b7)](https://codebeat.co/projects/github-com-hansejc-hansejc-github-io-master)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/HansEJC/hansejc.github.io.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/HansEJC/hansejc.github.io/context:javascript)
[![DeepSource](https://deepsource.io/gh/HansEJC/hansejc.github.io.svg/?label=active+issues&show_trend=true)](https://deepsource.io/gh/HansEJC/hansejc.github.io/?ref=repository-badge)

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
</div>

| Variable        | Description                                                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| I<sub>F</sub>   | Fault Current                                                                                                                 |
| I<sub>S</sub>   | Source Fault Current                                                                                                          |
| K<sub>RR</sub>  | 1 for single rail return, 2 for DRR                                                                                           |
| K<sub>T</sub>   | Number of tracks minus 1 (If one track, this is set to infinite)                                                              |
| L<sub>BT</sub>  | Distance Between BTs                                                                                                          |
| L<sub>C</sub>   | Current Location                                                                                                              |
| L<sub>S</sub>   | Distance between substations                                                                                                  |
| L<sub>XB</sub>  | Cross Bonding Distance (if L<sub>XB</sub> = 0 or L<sub>XB</sub> > LL<sub>S</sub> then L<sub>XB</sub> is set to L<sub>S</sub>) |
| L<sub>XBP</sub> | Distance since last Cross Bond                                                                                                |
| V<sub>S</sub>   | System Voltage                                                                                                                |
| Z<sub>AEW</sub> | AEW Impedance                                                                                                                 |
| Z<sub>ATF</sub> | ATF Impedance                                                                                                                 |
| Z<sub>BT</sub>  | BT Impedance                                                                                                                  |
| Z<sub>CAT</sub> | Catenary Impedance                                                                                                            |
| Z<sub>CW</sub>  | Contact Wire Impedance                                                                                                        |
| Z<sub>DEP</sub> | Departing Impedance                                                                                                           |
| Z<sub>F</sub>   | Fault Impedance                                                                                                               |
| Z<sub>OLE</sub> | Z<sub>CAT</sub> // Z<sub>CW</sub>                                                                                             |
| Z<sub>R</sub>   | Rail Impedance                                                                                                                |
| Z<sub>RET</sub> | Return Impedance                                                                                                              |
| Z<sub>RSC</sub> | RSC Impedance                                                                                                                 |
| Z<sub>S</sub>   | Source Impedance                                                                                                              |
| Z<sub>T</sub>   | Telecoms Impedance                                                                                                            |

<div class="row 50%">
	<p>
		Source Impedance:<br>
		<img src="http://www.sciweavers.org/tex2img.php?eq=%24%24%20Z_S%20%3D%20%7BV_S%20%5Cover%20I_S%7D%20%24%24&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0" align="center" border="0" alt="$$ Z_S = {V_S \over I_S} $$" width="64" height="28" /><br>	
		OLE Impedance:<br>
		<img src="https://bit.ly/2ZPOuwv" align="center" border="0" alt="$$ Z_{OLE} = \left({1 \over Z_{CAT}} + {1 \over Z_{CW}}\right)^{-1} $$" width="179" height="33" /><br>		
		<br>Depart Impedance (OLE impedance to fault):<br>
		<img src="https://bit.ly/37N2taF" align="center" border="0" alt="$$ {Z_{DEP} =} \left({1 \over Z_{OLE} \times L_C} + \left({Z_{OLE} \times L_S \over K_T} + Z_{OLE} \times (L_S - L_C) \right)^{-1} \right)^{-1} $$" width="417" height="39" /><br>		
		<br>The current location (L<sub>C</sub>) is reset to 0 at each substation. The distance between the substation (L<sub>S</sub>) changes after each substation. The impedance once 
		the current location (L<sub>C</sub>) reaches the substation distance (L<sub>S</sub>) is added to the impedance of the next calculated section.<br><br>		
		Return Impedance:<br>
		<img src="https://bit.ly/2PfUU6h" align="center" border="0" alt="$$ {Z_{RET} =} \left({1 \over Z_R \times L_{XBP}} + \left( \left({K_{RR} \times K_T \over Z_R \times L_{XB}} + {1 \over Z_{AEW} \times L_{XB}} + {1 \over Z_{RSC} \times L_{XB}} \right)^{-1} + Z_R \times (L_{XBP} - L_{XB}) \right)^{-1} \right)^{-1} $$" width="636" height="49" /><br>		
		<br>The distance since last cross bond (L<sub>XBP</sub>) is reset to 0 at each cross bond. The impedance once the distance since last cross bond (L<sub>XBP</sub>)
		reaches the cross bond distance (L<sub>XBP</sub>) is added to the impedance of the next calculated section.<br><br>		
		Fault Impedance:<br>
		<img src="https://bit.ly/3kod01a" align="center" border="0" alt="$$ Z_F = Z_{DEP} + Z_{RET} + Z_S $$" width="182" height="18" /><br>		
		Fault Current:<br>
		<img src="http://www.sciweavers.org/tex2img.php?eq=%24%24%20I_F%20%3D%20%7BV_S%20%5Cover%20Z_F%7D%20%20%24%24&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0" align="center" border="0" alt="$$ I_F = {V_S \over Z_F}  $$" width="56" height="28" />
	</p>
</div>
