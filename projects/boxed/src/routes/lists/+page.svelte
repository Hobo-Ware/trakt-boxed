<script lang="ts">
  import InView from "$boxed/components/InView.svelte";
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import SectionHeader from "$boxed/components/SectionHeader.svelte";
  import ListCardGrid from "$boxed/lists/ListCardGrid.svelte";
  import MyLists from "$boxed/lists/MyLists.svelte";
  import PopularLists from "$boxed/lists/PopularLists.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

{#snippet lazyGrid(title: string, href: string)}
  <SectionHeader {title} {href} />
  <ListCardGrid lists={null} emptyText="" reserveItems={4} />
{/snippet}

<TraktPage audience="all" image={DEFAULT_SHARE_COVER} title={m.page_title_lists()}>
  <PageContainer>
    <header class="boxed-lists-header">
      <h1>{m.page_title_lists()}</h1>
      <RenderFor audience="authenticated">
        <a class="boxed-lists-create" href="/lists/new">
          {m.button_text_cta_create_list()}
        </a>
      </RenderFor>
    </header>

    <section>
      <SectionHeader title={m.list_title_popular_lists()} />
      <PopularLists />
    </section>

    <RenderFor audience="authenticated">
      <section>
        <InView>
          <SectionHeader
            title={m.list_title_personal_lists()}
            href={UrlBuilder.lists.all("me", "personal")}
          />
          <MyLists type="personal" />
          {#snippet placeholder()}
            {@render lazyGrid(
              m.list_title_personal_lists(),
              UrlBuilder.lists.all("me", "personal"),
            )}
          {/snippet}
        </InView>
      </section>

      <section>
        <InView>
          <SectionHeader
            title={m.list_title_liked_lists()}
            href={UrlBuilder.lists.all("me", "liked")}
          />
          <MyLists type="liked" />
          {#snippet placeholder()}
            {@render lazyGrid(
              m.list_title_liked_lists(),
              UrlBuilder.lists.all("me", "liked"),
            )}
          {/snippet}
        </InView>
      </section>
    </RenderFor>
  </PageContainer>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-lists-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);

    h1 {
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-40);
      font-weight: 600;
      line-height: 1.2;

      @include for-mobile {
        font-size: var(--ni-28);
      }
    }
  }

  .boxed-lists-create {
    display: inline-flex;
    align-items: center;
    height: var(--ni-40);
    padding-inline: var(--ni-18);
    border-radius: var(--border-radius-m);
    background: var(--purple-500);
    color: var(--shade-10);
    font-size: var(--ni-14);
    font-weight: 600;
    text-decoration: none;

    &:hover {
      background: var(--purple-600);
    }
  }
</style>
