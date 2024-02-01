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
            ברוכים הבאים לאתר
            <span
              className="ms-1 me-1 wave-once"
              style={{
                color: "#e5b55c",
                fontSize: "25px",
                fontWeight: "600",
              }}
            >
              תורתך שעשועי
            </span>
            מקום בו תוכלו למצוא מגוון מוצרי תשמישי קדושה גבוהה ואיכותית. אנחנו
            מחויבים לספק לכם את המוצרים הטובים ביותר לצורכי קדושה ולרגלי חגים.
          </p>
          <p>
            <strong>מי אנחנו?</strong>
            <br />
            אנחנו צוות של מאמינים שמבינים את החשיבות שבמוצרי תשמישי קדושה טובים
            ואיכותיים. אנו עושים את מיטב המאמץ כדי לאתר ולספק את המוצרים
            המתאימים ביותר לצרכיכם.
          </p>
          <p>
            <strong>מה אנו מציעים?</strong>
            <br />
            אתרנו מציע מגוון רחב של מוצרי תשמישי קדושה, כוללים ספרים, כפרי
            סידור, תפילין, מזוזות, ועוד. אנו גאים באיכות המוצרים שאנו מציעים
            ובשירות המעולה שאנו מעניקים ללקוחותינו.
          </p>
          <p>
            <strong>למה לבחור בנו?</strong>
            <br />
            • איכות מוצרים מעולה: אנו רואים חשיבות גדולה באיכות המוצרים שאנו
            מציעים ונשמח להעניק לכם את הטוב ביותר.
            <br />
            • צוות מקצועי: הצוות שלנו מיומן ונכון לעזור לכם בכל שאלה או בקשה שיש
            לכם.
            <br />
            • משלוח מהיר: אנו מתחייבים למשלוח מהיר ובזמן.
            <br />• שירות לקוחות מעולה: אנו זמינים לשאלות, הערות ובקשות בכל עת.
          </p>
          <strong>צרו קשר</strong>

          <p>
            נשמח לשמוע מכם ולעזור בכל שאלה או בקשה שיש לכם. אנו זמינים בכל עת
            לצורך ייעוץ או למענה על שאלותיכם. תודה רבה שבחרתם בחנות "תורתך
            שעשועי" - המקום המוביל למוצרי תשמישי קדושה ברמה הגבוהה ביותר.
            <br />
            <br />
            <strong>
              חברי מועדון VIP מקבלים קופון 10% הנחה לכל הזמנה הצטרפו עכשיו:{" "}
            </strong>
            <Link
              to="/sign-up"
              onClick={handleSignUpClick}
              className="ms-2 text-decoration-none fw-bold"
            >
              להרשמה חינם לחץ כאן 😊
            </Link>
          </p>
        </>
      }
    />
  );
};

export default About;
