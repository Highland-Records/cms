import React from "react";
import HomeNavigation from "./Navigation";

class About extends React.Component {
	componentDidMount() {
		window.scrollTo(0, 0);
	}
	render() {
		return (
			<section className="SplashStyle">
				{HomeNavigation.DrawNavigation("about")}
				<div class="banner other about">
					<p>
						About us
					</p>
				</div>
				<ul className="home">
					<li>
						Music to make you feel something
					</li>
					<li>
						<h2>Highland Records is a new, up &amp; coming record label focusing on wide variety of genres.</h2>
						From humble beginnings Highland Records has had the passion to make people feel something when they listen to one of our songs.<br/><br/>We're known for delivering high quality and versatile music, resulting in our songs regularly being featured in film, TV, advertising, movie trailers and video games. Our team has a broad network of music supervisors, advertising &amp; film agencies, and is constantly looking for new opportunities for our music.<br/><br/>Use the contact information below to get in touch with us and discuss any opportunities you may have.
					</li>
				</ul>
				<div className="list">
					<h1>
						Get in touch
					</h1>
					<ul className="about">
						<li>
							<iframe title="aboutMap" src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2483.6651012515667!2d-0.191262!3d51.5010129!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48760ff6f1f6178f%3A0x701a62d3dea882c1!2s9+Derry+St%2C+Kensington%2C+London+W8+5HY!5e0!3m2!1sen!2suk!4v1430156567286" frameborder="0"></iframe>
						</li>
						<li>
							<ul>
								<li>
									<i class="fas fa-at"></i>
									hello@highlandrecords.com
								</li>
								<li>
									<i class="fas fa-map-marker-alt"></i>
									9 Derry Street<br/>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;London<br/>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;W8 5HY
								</li>
								<li>&nbsp;</li>
								<li>
									<i class="fab fa-facebook"></i>
									/HighlandRecords
								</li>
								<li>
									<i class="fab fa-twitter"></i>
									@HighlandRecords
								</li>
								<li>
									<i class="fab fa-instagram"></i>
									@HighlandRecords
								</li>
							</ul>
						</li>
					</ul>
				</div>
				<div className="list">
					<h1>
						People behind Highland
					</h1>
					<ul className="about-list">
						<li>
							<div>
								<img src="http://highland.oliverrichman.uk/api/images/people/1.jpg" alt="Oliver Richman" />
								<h2>Oliver Richman</h2>
								<span>Developer &amp; Designer</span>
							</div>
						</li>
						<li>
							<div>
								<img src="http://highland.oliverrichman.uk/api/images/people/2.jpg" alt="Tom Smedley" />
								<h2>Tom Smedley</h2>
								<span>Developer &amp; Designer</span>
							</div>
						</li>
						<li>
							<div>
								<img src="http://highland.oliverrichman.uk/api/images/people/3.jpg" alt="Yudi Chen" />
								<h2>Yudi Chen</h2>
								<span>Video Producer</span>
							</div>
						</li>
						<li>
							<div>
								<img src="http://highland.oliverrichman.uk/api/images/people/4.jpg" alt="Fletcher Alderson" />
								<h2>Fletch Alderson</h2>
								<span>Developer &amp; Designer</span>
							</div>
						</li>
						<li>
							<div>
								<img src="http://highland.oliverrichman.uk/api/images/people/5.jpg" alt="Joe Robinson" />
								<h2>Joe Robinson</h2>
								<span>Media Producer</span>
							</div>
						</li>
					</ul>
				</div>
				<footer>
					<div className="c">
						<i>Highland</i>
						<p>&copy; 2018 Highland Records</p>
					</div>
				</footer>
			</section>
		);
	}
}

export default About;
