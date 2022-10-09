
window.addEventListener("load", function(e){

	fillContentSection();
	
	function fillContentSection() {
		var version = "2.1.0";

		var cS = document.querySelector(".content-section");
		if (!cS)
			return;

		cS.dataset.contents_sectionVer = version;
		cS.classList.add("activated");
		
		const 
			parentEl = cS.parentElement,
			hColl = [...parentEl.querySelectorAll("h1, h2, h3, h4, h5, h6")],
			rootNode = new Node(0),
			stack = [rootNode],
			nodes = hColl.map((h) => new Node(h));
		
		nodes.forEach((node) => {
			let max = 10;
			while (max --) {
				const last = stack[stack.length - 1];
				if (last.hLevel + 1 === node.hLevel) {
					last.ch.push(node);
					stack.push(node);
					break;
				} else if (last.hLevel + 1 > node.hLevel) {
					stack.pop();
				} else if (last.hLevel + 1 < node.hLevel) {
					const pseudoNode = new Node(last.hLevel + 1);
					last.ch.push(pseudoNode);
					stack.push(pseudoNode);
				}
			}
		});
		console.log(`rootNode >>`, rootNode);

		cS.append(...buildContentTree(rootNode.ch[0].ch));
	}

	function buildContentTree(nodeArr) {
		let i = 1;
		return nodeArr.map(recur);
		function recur(node) {
			const 
				h = node.hDOM,
				hA = document.createElement("a"),
				hType = h ? h.nodeName.toLowerCase() : "",
				text = h ? h.textContent.replace(/</g, "&lt;") : "&nbsp;",
				hId =  h ? h.id || "hr-"+(i++) : ""
			
			hA.classList.add("content-section--scroll-to-content-list");
			hA.setAttribute("href", "#"+hId+"_cl_link")
			
			if (h) {
				h.setAttribute("id", hId+"_header");
				h.appendChild(hA);
			}
			
			const dom =  eHTML(`
				<div class="c-tree__branch">
					<div class="c-tree__b-heder">
						<a 
							href="#${hId+"_header"}" 
							class="${hType}-link-a" 
							name="${hId}_cl_link"
						>${text}</a>
					</div>
				</div>
			`);
			if (node.ch?.length) {
				for (const child of node.ch) {
					dom.append(recur(child));
				}
			}
			return dom;
		}
	}

	function Node(x) {
		if (typeof x === "number") {
			this.hLevel = x;
			this.ch = [];
		} else if (x instanceof HTMLHeadingElement) {
			this.hLevel = parseInt(x.tagName.slice(1));
			this.ch = [];
			this.hDOM = x;
			this.tagName = x.tagName;
			this.textContent = x.textContent;
		} else {
			console.error(`(!)-USER'S `, `Invalid argument to constructor.`);
		}
	}

	function eHTML(code, shell=null) {
		const _shell = 
			! shell                  ? document.createElement("div") :
			typeof shell == "string" ? document.createElement(shell) :
			typeof shell == "object" ? shell :
				null;
		_shell.innerHTML = code;
		return _shell.children[0];
	}

	function eHTMLDF(code) {
		const _shell = document.createElement("template");
		return _shell.innerHTML = code, _shell.content;
	}

}, false);
