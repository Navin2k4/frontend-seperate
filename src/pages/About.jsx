import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex items-center ">
      <div className="max-w-2xl mx-auto p-3 text-center mb-20">
        <div>
          <Link
            to="/"
            className="tracking-widest text-xl font-bold dark:text-white leading-normal md:text-3xl lg:text-4xl"
          >
            <span className="px-2 py-1 bg-custom-gradient rounded-lg text-white mr-2 ">
              SimpleOne
            </span>
            Chronicles
          </Link>
          <div className="text-md text-gray-500 flex flex-col gap-5 mt-10 mx-auto">
            <p className="dark:text-white">
              Welcome to Event App, spearheaded by Stellar, a dedicated advocate
              for positive change in Event communities.
            </p>
            <p className="dark:text-gray-200 text-black">
              Discover Weekly Insights
            </p>
            <p className="text-gray-400">
              Explore our collection of weekly articles and tutorials covering a
              spectrum of topics, from Event development to community
              empowerment and sustainable living practices. Stay tuned for
              latest insights and innovations aimed at Apping Event areas.
            </p>

            <p className="dark:text-gray-200 text-black">
              Engage in Collective Action
            </p>
            <p className="text-gray-400">
              We believe in the power of community collaboration. Join us in
              fostering discussions, sharing ideas, and taking action towards
              building healthier, more vibrant cities for all. Leave your
              comments, engage with fellow changemakers, and together, let's
              make a lasting impact on Event landscapes.
            </p>

            <p className="dark:text-gray-200 text-black">
              Together, Let's Transform Cities
            </p>
            <p className="text-gray-400">
              Event App is more than just a blog—it's a catalyst for change.
              Join our movement to create inclusive, resilient, and sustainable
              Event environments. Together, let's transform cities into thriving
              hubs of opportunity and well-being.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
