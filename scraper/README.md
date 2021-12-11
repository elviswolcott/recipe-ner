# TODO:
* make a README
* attribution
* information on respecting robots.txt
    * out of scope for this project, would be good to add in the future
* future extension: have a way for websites to submit their sitemaps (like a search engine has)
* shuffle recipes around to distribute load across sites (will also help with respecting rate limits)
* handle the fact that sometimes people post things that aren't recipes!

incompatible:
* https://www.pickuplimes.com/sitemap.xml
    * custom solution doesn't include recipe steps in JSON LD
* https://olivesfordinner.com/sitemap.xml
    * has per-month sitemaps that would require an additional parsing layer
* https://wellvegan.com/post-sitemap.xml
    * didn't want to bother with rate limits yet