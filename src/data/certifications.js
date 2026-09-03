// Add or remove certificates here — the shelf renders automatically from this array.
//
// thumbnail: small optimized image shown on the shelf (public/certificates/thumbnails/)
// image:     full-resolution certificate shown in the modal (public/certificates/)

const certifications = [
  {
    title: "Python",
    issuer: "Kaggle",
    date: "August 2026",
    thumbnail: "/certificates/thumbnails/kaggle-python.png",
    image: "/certificates/python.png",
    credentialUrl: "",
    skills: ["Python", "Programming"],
  },
  {
    title: "Fullstack Development",
    issuer: "Udemy",
    date: "August 2025",
    thumbnail: "/certificates/thumbnails/fullstack-udemy.png",
    image: "/certificates/udemy-fullstack.jpg",
    credentialUrl: "",
    skills: ["Frontend", "Backend"],
  },
  {
    title: "AlgoTech Fellowship 2025",
    issuer: "AlgoUniversity",
    date: "July 2025",
    thumbnail: "/certificates/thumbnails/atfThumbnail2025.png",
    image: "/certificates/atf2025.jpg",
    credentialUrl: "",
    skills: ["Problem Solving", "Data Structures and Algorithm"],
  },
  {
    title: "Mechatronics",
    issuer: "Siemens",
    date: "June 2025",
    thumbnail: "/certificates/thumbnails/siemensMechaThumbnail.png",
    image: "/certificates/siemensMecha.jpg",
    credentialUrl: "",
    skills: ["Mechanical", "Electrical", "Basic Computing"],
  },

];

export default certifications;