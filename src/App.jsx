import "bootstrap/dist/css/bootstrap.min.css";
import Form from "./componets/Form";
import Header from "./componets/Header";

const App = () => {
	return (
		<div
			className="d-flex justify-content-center align-items-center"
			style={{
				height: "100vh",
				background: "linear-gradient(#e66465, #9198e5)",
			}}
		>
			<div className="card col-lg-6 col-md-9 col-sm-11">
				<div className="card-header">
					<Header header="Aricoma Form" />
				</div>
				<div className="card-body">
					<Form />
				</div>
			</div>
		</div>
	);
};

export default App;
