export type subdomainHost< D extends string, S extends string >  = S extends  "@" ? D : `${S}.${D}`;

export function hostFor< const D extends string, const S extends string>(domain: D, subdomain: S): subdomainHost<D, S> {
    return (subdomain === "@" ? domain : `${subdomain}.${domain}`) as subdomainHost<D, S>;
}

