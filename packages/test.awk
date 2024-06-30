# (match($0, /(.*) \((.*)\) < (.*)/, out)){i+=1; for (x = 1; x <= 3; x+=1) a[i,x]=out[x]} END {len=length(a)/3;for(x=1;x<=3;x+=1) max[x]=0;for (i=1;i<=len;i+=1) {for(x=1;x<=3;x+=1) if (length(a[i,x])>max[x]) max[x]=length(a[i,x])} for (i=1;i<=len;i+=1) printf "%-*s \t \x1b[31m%*s\x1b[0m  \x1b[90m→\x1b[39m   \x1b[32m%*s\x1b[0m\n", max[1], a[i,1], max[2], a[i,2], max[3], a[i,3]}
match($0, /([A-f0-9]{2})([A-f0-9]{2})([A-f0-9]{2})/, c) {
    r = strtonum("0x"c[1])
    g = strtonum("0x"c[2])
    b = strtonum("0x"c[3])

    hex = "#"$1$2$3
    printf "\x1b[38;2;%d;%d;%dm#%02x02x%02x -> %3d %3d %3d\x1b[0m\n", r, g, b, r, g, b, r, g, b
}
