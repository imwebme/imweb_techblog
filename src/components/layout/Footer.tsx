const CONFIG = require("../../../site.config")

export default function Footer() {
  const year = new Date().getFullYear()
  const { company } = CONFIG

  return (
    <footer className="border-t border-line mt-24 pt-10 pb-12 text-sm text-ink-500">
      <div className="container mx-auto">
        <div>
          <div className="font-semibold text-ink-900 text-base">
            {CONFIG.blog.title}
          </div>
          <div className="mt-1 text-ink-700">{CONFIG.blog.description}</div>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-6 text-xs leading-relaxed">
          <div>
            <div className="mb-3 text-ink-900 font-medium text-[13px]">메뉴</div>
            <ul className="space-y-2">
              <li>
                <a
                  href={CONFIG.social.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink-900"
                >
                  아임웹
                </a>
              </li>
              <li>
                <a
                  href={CONFIG.social.careers}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink-900"
                >
                  채용
                </a>
              </li>
              <li className="text-ink-700">
                {CONFIG.social.contactEmail}
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-3 text-ink-900 font-medium text-[13px]">
              회사 정보
            </div>
            <dl className="space-y-1.5">
              <div className="flex gap-2">
                <dt className="shrink-0 text-ink-700">상호명</dt>
                <dd>{company.name}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 text-ink-700">대표이사</dt>
                <dd>{company.ceo}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 text-ink-700">개인정보책임자</dt>
                <dd>{company.privacyOfficer}</dd>
              </div>
            </dl>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="mb-3 text-ink-900 font-medium text-[13px]">
              등록 정보
            </div>
            <dl className="space-y-1.5">
              <div className="flex gap-2">
                <dt className="shrink-0 text-ink-700">사업자등록번호</dt>
                <dd>{company.businessNumber}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 text-ink-700">통신판매업</dt>
                <dd>{company.ecommerceNumber}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 text-ink-700">본사</dt>
                <dd>{company.address}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-10 text-xs text-ink-500">© {year} Imweb</div>
      </div>
    </footer>
  )
}
