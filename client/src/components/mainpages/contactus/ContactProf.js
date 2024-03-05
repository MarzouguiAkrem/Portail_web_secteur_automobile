import ContactUs  from '../contactus/ContactUs';

function contactProf() {
  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-5">
          <ContactUs />
        </div>
        <div className="col-md-7 my-auto">
        </div>
      </div>
    </div>
  );
}

export default contactProf;