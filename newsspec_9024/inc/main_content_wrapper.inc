				<!--#include virtual="/news/special/2014/newsspec_9024/inc/load_glow.inc" -->
				<style type="text/css">
					body .ukcas-enclosure {
						font-size: 14px;
					}

					body .ukcas-enclosure * {
						font-size: 14px;
					}

					#loading {
						height: 33px;
						width: 33px;
					}

					#loading,
					#loading img {
						height: 33px;
						width: 33px;
					}

					.ukcas-enclosure #navBar h3 {
						font-weight: bold;
					}
					body .ukcas-enclosure #navBar div.ukcas-nav-collection ul {
						margin-top: 2px;
					}

					#responsive-list {
						display: none;
					}


				</style>

				<div id="ukmc-viewport">
					<div id="responsive-list">
	                	<!--#include virtual="/news/special/2014/newsspec_6761/content/english/index.inc" -->
	                </div>

					<div id="desktop-faces">
	                	<!--#include virtual="/nol/shared/spl/hi/in_depth/uk_military_casualties_v6/refactored_facewall/inc/facewall.inc" -->
	                </div>
	            </div>

				<script>

					var currentState = 'desktop';

					function displayCasualtiesData() {
						if (document.getElementById('ukmc-viewport').clientWidth >= 752) {
							if (currentState !== 'desktop') {
								document.getElementById('responsive-list').style.display = 'none';
								document.getElementById('desktop-faces').style.display = 'block';
							}
							currentState = 'desktop';
						} else {
							if (currentState !== 'responsive') {
								document.getElementById('desktop-faces').style.display = 'none';
								document.getElementById('responsive-list').style.display = 'block';
							}
							currentState = 'responsive';
						}
					}

					window.addEventListener('resize', function(event){

						displayCasualtiesData();

					});

					displayCasualtiesData();

				</script>

