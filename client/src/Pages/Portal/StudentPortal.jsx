const StudentPortal = ({ user }) => {
  return (
    <div>
      <h1 className="heading center">Welcome {user?.fullName} </h1>

      {/* text-wrapper */}
      <div className="text-wrapper">
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias quod
          nulla qui exercitationem aperiam quasi quaerat modi nihil eaque
          reiciendis!
        </p>
      </div>
      {/* end text-wrapper */}
      {/* menu wrapper */}
      <div className="menu-wrapper">
        {/* menu-unit */}
        <div className="menu-unit">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            officia dolorum fugiat ut voluptas delectus possimus cupiditate
            corporis necessitatibus suscipit.
          </p>
        </div>
        {/* end mneu unit */}

        {/* menu-unit */}
        <div className="menu-unit">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            officia dolorum fugiat ut voluptas delectus possimus cupiditate
            corporis necessitatibus suscipit.
          </p>
        </div>
        {/* end mneu unit */}

        {/* menu-unit */}
        <div className="menu-unit">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            officia dolorum fugiat ut voluptas delectus possimus cupiditate
            corporis necessitatibus suscipit.
          </p>
        </div>
        {/* end mneu unit */}

        {/* menu-unit */}
        <div className="menu-unit">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            officia dolorum fugiat ut voluptas delectus possimus cupiditate
            corporis necessitatibus suscipit.
          </p>
        </div>
        {/* end mneu unit */}
      </div>
      {/* end menu-wrapper */}
    </div>
  );
};

export default StudentPortal;
