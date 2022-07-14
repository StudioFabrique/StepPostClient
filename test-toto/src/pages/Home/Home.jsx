import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../components/AuthProvider/AuthProvider";
import ListeCourriers from "../../components/ListeCourriers/ListeCourriers";
import { getData } from "../../modules/fetchData";
import "./Home.css";

function Home() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [courriers, updateCourriers] = useState([]);
  useEffect(() => {
    getData("http://localhost:8000/api/courriers", auth.token).then(
      (response) =>
        response.json().then((response) => {
          if (!response.code !== 401) {
            updateCourriers(response.response);
          } else {
            navigate("/logout");
          }
        })
    );
  }, [auth.token, navigate]);
  return (
    <main className="home-main">
      <ListeCourriers courriers={courriers} />
    </main>
  );
}

export default Home;
