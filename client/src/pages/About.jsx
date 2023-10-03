export default function About() {
  return (
    <>
      <div className="max-w-6xl mx-auto p-5">
        <div className="flex flex-col gap-3 md:flex-row md:gap-6 mt-24">
          <div className="text-center overflow-hidden">
            <img
              src="/cropped-spence.jpg"
              alt="pic"
              className="h-32 w-32 rounded-full object-cover hover:scale-105 duration-100 transition-all"
            />
            <h3 className="text-xs">Spencer Cecil</h3>
            <h3 className="text-xs">scecil072@gmail.com</h3>
          </div>
          <div className="flex-1">
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia et voluptates enim, at beatae, quasi quaerat
              iusto quis ex minus dolorem, animi cum blanditiis temporibus! Unde quam, perspiciatis facere magni sapiente
              laudantium cum illum molestias? Earum obcaecati quae unde laboriosam enim perferendis delectus voluptas rem modi
              minima corporis aspernatur labore tempore blanditiis nulla ullam quia amet, inventore consequuntur, temporibus
              placeat ex sit. Placeat cum minima aspernatur voluptatum eligendi? Odit rerum, consequuntur saepe quibusdam ipsum
              laudantium? Maxime dolorum excepturi amet obcaecati!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
