import React from "react";
import PageHeader from "../common/pageHeader";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import Swal from "sweetalert2";

const About = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignUpClick = (e) => {
    e.preventDefault();

    if (user) {
      Swal.fire({
        title: "You are already Business! 😊",
        icon: "info",
        timer: 1300,
        timerProgressBar: true,
      });
    } else {
      navigate("/sign-up");
    }
  };
  return (
    <PageHeader
      title={<>About Us</>}
      description={
        <>
          <p>
            Welcome to
            <span
              className="ms-1 me-1 wave-once"
              style={{
                color: "#e5b55c",
                fontSize: "25px",
                fontWeight: "600",
              }}
            >
              ClickEvent
            </span>
            , your destination for unforgettable event experiences and smooth
            event planning. We believe that every event, big or small, is an
            opportunity to create lasting memories and connect people.
          </p>
          <p>
            <strong>Who We Are?</strong>
            <br />
            From concerts and conferences to weddings and special occasions, our
            platform provides you with the tools to create, manage, and share
            events effortlessly. We enable you to focus on creating an amazing
            experience for your guests while we take care of the technical
            details.
          </p>
          <p>
            <strong>Our Journey</strong>
            <br />
            Our platform was born out of a passion for meaningful events and
            experiences. With years of experience in the event industry, our
            team comprises experts including event planners, tech developers,
            and marketing specialists, all committed to bringing you the best
            experience.
          </p>
          <p>
            <strong>What We Offer</strong>
            <br />
            We are proud to offer a range of services that include:
            <br />
            - Easy Event Creation: Build stunning event pages quickly.
            <br />
            - Ticket Management: Sell tickets, track sales, and manage
            attendees.
            <br />
            - Dynamic Promotion: Reach a broader audience with our marketing
            tools.
            <br />
            - Seamless Registration: Attendees can sign up quickly and securely.
            <br />
            - Event Analytics: Gain insights into your event's performance.
            <br />
            - Collaborative Planning: Work together with your team in real-time.
            <br />- Attendee Engagement: Keep your guests informed and engaged.
          </p>
          <p>
            Join us in our mission to transform the way events are planned and
            experienced. We are more than just a platform; we are a community of
            event enthusiasts committed to making your next event a resounding
            success. Get started today!{" "}
            <Link
              to="/sign-up"
              onClick={handleSignUpClick}
              className="ms-2 text-decoration-none fw-bold"
            >
              Sign-Up
            </Link>
          </p>
        </>
      }
    />
  );
};

export default About;
