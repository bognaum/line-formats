
window.addEventListener("load", function(e){
	
	function fillContentsSection() {
		var version = "2.1.0";

		var cS = document.querySelector(".contents-section");
		if (!cS)
			return;

		cS.dataset.contents_sectionVer = version;
		cS.classList.add("activated");
		
		var parentEl = cS.parentElement;

		var 
			coll = parentEl.querySelectorAll("h1, h2, h3, h4, h5, h6"),
			html = "";	
			

		for (var i = 0; i < coll.length; i++) {
			var 
				h = coll[i],
				hA = document.createElement("a"),
				hType = h.nodeName.toLowerCase(),
				text = h.textContent.replace(/</g, "&lt;"),
				hId = h.id || "hr-"+i
			
			hA.classList.add("contents-section--scroll-to-content-list");
			hA.setAttribute("href", "#"+hId+"_cl_link")

			h.setAttribute("id", hId+"_header");
			h.appendChild(hA);

			html += `
				<div class="${hType}-link-div">
					<a href="#${hId+"_header"}" class="${hType}-link-a" name="${hId}_cl_link">${text}</a>
				</div>
			`;
		}

		cS.innerHTML += html;
	}

	fillContentsSection();

}, false);
