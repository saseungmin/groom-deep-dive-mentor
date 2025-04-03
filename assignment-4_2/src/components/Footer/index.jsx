import React from "react";
import "./index.css";

function Footer() {
	return (
		<div className="footer-container">
			<div className="footer-links">
				<a href="#">소개</a> · <a href="#">도움말</a> ·{" "}
				<a href="#">홍보 센터</a> · <a href="#">API</a> ·
				<a href="#">채용 정보</a> · <a href="#">개인정보처리방침</a> ·{" "}
				<a href="#">약관</a> ·<a href="#">위치</a> · <a href="#">인기 계정</a> ·{" "}
				<a href="#">해시태그</a> · <a href="#">언어</a>
			</div>

			<div className="copyright">© 2025 instagram from meta</div>
		</div>
	);
}

export default Footer;
