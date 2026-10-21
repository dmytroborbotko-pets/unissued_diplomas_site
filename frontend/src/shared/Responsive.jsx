// Text that the old mobile pages show differently (texts `mobileText`); falls back to the desktop text
export const Responsive = ({ mobile, children }) =>
  mobile && mobile !== children ? (
    <>
      <span className="tablet:hidden">{mobile}</span>
      <span className="max-tablet:hidden">{children}</span>
    </>
  ) : (
    children
  );
