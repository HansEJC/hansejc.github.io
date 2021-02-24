# hansejc.github.io
Hobby website I use to simplify my life

<header id="dobble"><hr>
							<h1>Dobble</h1>
						</header>
						<div class="row 100%">
							<p> This game can be played by one or two players. You can only get a high score in one player mode. Try to find a matching symbol
								between the reference and player card. Every card has one match. Click on the match to gain a point and receive a new card. 
								If you click on the wrong match, one point will be deducted. This is to avoid cheating by spamming click. The math used to create this game
								can be found <a href="https://www.petercollingridge.co.uk/blog/mathematics-toys-and-games/dobble/">here</a>.
							</p>
						</div>
						<header id="csv"><hr>
							<h1>CSV Plotter</h1>
						</header>
						<div class="row 100%">
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
						<div class="row 100%">
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
						<div class="row 100%">
							<p>	The calculations used for this page have been extracted from <a href="http://www.dcode.org.uk/assets/uploads/ENA_ER_S34_Issue_2__2018_.pdf">Engineering Recommendation EREC S34</a> and 
								<a href="https://www.ena-eng.org/ENA-Docs/D0C3D1R/TS_41-24_181106101835.pdf">Technical Specification 41-24</a>.
							</p>
						</div>
						<header id="soil"><hr>
							<h1>Earthing Surveys</h1>
						</header>
						<div class="row 100%">
							<p>	This page can be used to document the results of Soil Resistivity and Fall of Potential surveys. Enter the test location to save 
								the results with the specified site name. Enter the soil resistance values and check that the soil resistivity values are consistent.
							</p>
						</div>
						<header id="tools"><hr>
							<h1>Electrical Engineering Tools Excel Equations</h1>
						</header>
						<div class="row 100%">
							<p><a href="downloads/Polar Addition.xlsx">Polar Additions</a>
							</p>
						</div>
