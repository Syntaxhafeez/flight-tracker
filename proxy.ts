import { NextResponse, type NextRequest } from "next/server";

const CANONICAL_HOST = "aerotrackr.online";
const WWW_HOST = `www.${CANONICAL_HOST}`;

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const requestHost = (request.headers.get("host") ?? url.hostname).split(":")[0];
  const isProductionHost = requestHost === CANONICAL_HOST || requestHost === WWW_HOST;

  if (!isProductionHost) {
    return NextResponse.next();
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProto ?? url.protocol.replace(":", "");
  let shouldRedirect = false;

  if (requestHost !== CANONICAL_HOST) {
    url.hostname = CANONICAL_HOST;
    url.port = "";
    shouldRedirect = true;
  }

  if (protocol !== "https") {
    url.protocol = "https:";
    url.port = "";
    shouldRedirect = true;
  }

  if (url.pathname === "/" && url.search) {
    url.search = "";
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";

    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)"],
};
