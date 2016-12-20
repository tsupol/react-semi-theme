import React, {PropTypes} from 'react';

const PageHeading = ({title, description, type}) => {
   let className = 'page-heading';
   if(type == 'collapsed') className += ' page-heading-collapsed';
   return (
	  <div className={className}>
		 <h1 className="title">{title}</h1>
		 <p className="description">{description}</p>
	  </div>
   );
};

PageHeading.propTypes = {
   title: PropTypes.string,
   description: PropTypes.string
};

export default PageHeading;