type WorkspaceHeaderInfoProps = {
  kicker: string;
  heading: string;
  userEmail: string;
};

export default function WorkspaceHeaderInfo({
  kicker,
  heading,
  userEmail,
}: WorkspaceHeaderInfoProps) {
  return (
    <div>
      <p className="ui-kicker">{kicker}</p>
      <h1 className="ui-title-4 mt-3">{heading}</h1>
      <p className="ui-copy mt-3">현재 로그인된 계정은 {userEmail} 입니다.</p>
    </div>
  );
}
